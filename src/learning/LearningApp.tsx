import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { speak, stopSpeaking } from "../quiz/speech";
import { normalizeAnswer } from "../quiz/quizLogic";
import {
  clearStudentSession,
  loadStudentSession,
  saveStudentSession,
  type StudentSession,
} from "../game/utils/studentSession";
import {
  learningApplication,
  type AnswerResult,
  type HintResult,
  type LearningSubject,
  type LessonPlanActivity,
  type LessonPlanView,
  type LessonSupportLevel,
  type GradeProgress,
  type PlacementResult,
  type ResumableLearningSession,
  type SessionView,
} from "./learningApplication";
import { coreCourseRoadmap } from "./coreCourseRoadmaps";
import { KindergartenLessonActivity } from "./KindergartenLessonActivity";
import { GuidedLessonPlayer } from "./GuidedLessonPlayer";
import { GradeProgressCard } from "./GradeProgressCard";
import "./learning.css";

type ProgressAttempt = {
  sessionId: string;
  primaryStandardId: string;
  correct: boolean;
  usedHint: boolean;
  independent: boolean;
  purpose: string;
  submittedAnswer: unknown;
};
type Progress = {
  attempts: ProgressAttempt[];
  mastery: Array<{
    standardId: string;
    state: string;
    nextReviewAt: string | null;
  }>;
  skillProgress: Array<{
    skillId: string;
    skillName: string;
    domain: string;
    state: string;
  }>;
  latestDiagnosticPlacement: PlacementResult | null;
  latestGradeReview?: PlacementResult | null;
  latestAssessmentSessionId: string | null;
  gradeProgress?: GradeProgress[];
};
type Classification = Record<string, string>;
type BrowserRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  onresult:
    | ((event: {
        results: {
          [index: number]: { [index: number]: { transcript: string } };
        };
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type BrowserRecognitionConstructor = new () => BrowserRecognition;

const CORRECT_ANSWER_ADVANCE_MS = 2_200;
const confettiColors = [
  "#e76f51",
  "#f4c95d",
  "#4ca58c",
  "#7563a6",
  "#e88dac",
  "#3f87c5",
];
const confettiPieces = Array.from({ length: 28 }, (_, index) => ({
  color: confettiColors[index % confettiColors.length],
  delayMs: (index * 47) % 360,
  drift: ((index * 73) % 180) - 90,
  left: (index * 37) % 100,
  rotation: (index * 67) % 360,
}));

function CorrectAnswerConfetti({
  burstKey,
}: {
  burstKey: string;
}): JSX.Element {
  return (
    <div className="learning-confetti" aria-hidden="true" key={burstKey}>
      {confettiPieces.map((piece, index) => (
        <span
          className="learning-confetti-piece"
          key={`${burstKey}-${index}`}
          style={
            {
              left: `${piece.left}%`,
              "--confetti-color": piece.color,
              "--confetti-delay": `${piece.delayMs}ms`,
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-rotation": `${piece.rotation}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function answerFromTranscript(
  transcript: string,
  choices: Array<{ label: string }>,
): string {
  const normalizedTranscript = normalizeAnswer(transcript);
  return (
    choices.find(
      (choice) => normalizeAnswer(choice.label) === normalizedTranscript,
    )?.label ?? transcript
  );
}

function classificationData(
  session: SessionView | null,
): { items: string[]; categories: string[] } | null {
  if (session?.question.responseType !== "classification") return null;
  const { items, categories } = session.question.interaction;
  return Array.isArray(items) && Array.isArray(categories)
    ? { items, categories }
    : null;
}

function sequenceData(session: SessionView | null): string[] | null {
  if (session?.question.responseType !== "sequence") return null;
  const { items } = session.question.interaction;
  return Array.isArray(items) ? items : null;
}

const phonemeAudio: Record<string, string> = {
  a: "ah",
  b: "buh",
  c: "kuh",
  d: "duh",
  e: "eh",
  f: "fff",
  g: "guh",
  h: "huh",
  i: "ih",
  j: "juh",
  k: "kuh",
  l: "lll",
  m: "mmm",
  n: "nnn",
  o: "oh",
  p: "puh",
  q: "kwuh",
  r: "rrr",
  s: "sss",
  t: "tuh",
  u: "uh",
  v: "vvv",
  w: "wuh",
  x: "ks",
  y: "yuh",
  z: "zzz",
  sh: "shh",
  ch: "ch",
  th: "th",
};

function phonemeChoiceAudio(label: string): string {
  return label
    .split(",")
    .map((sound) => phonemeAudio[sound.trim().toLowerCase()] ?? sound.trim())
    .join(", ");
}

function isPhonemeChoiceQuestion(
  session: SessionView | null,
  choices: Array<{ id: string; label: string }>,
): boolean {
  return Boolean(
    session &&
    choices.length > 1 &&
    /\b(sound|phoneme)\b/i.test(session.question.prompt.text) &&
    choices.every((choice) =>
      choice.label.split(",").every((sound) => sound.trim().length <= 2),
    ),
  );
}

function adultEvidenceNote(answer: unknown): string | null {
  if (
    typeof answer !== "object" ||
    answer === null ||
    !("adultEvidence" in answer)
  )
    return null;
  const evidence = (answer as { adultEvidence?: unknown }).adultEvidence;
  return typeof evidence === "string" && evidence.trim() ? evidence : null;
}

type LearningPurpose =
  | "practice"
  | "diagnostic"
  | "placement"
  | "gradeReview"
  | "proctored"
  | "adultScored";
type LearningLevel = "K" | "GRADE_1" | "GRADE_2";
type ReviewGrade = "K" | "1" | "2";

// 75% is the lowest pass mark allowed; adults may only raise the bar.
const PASS_MARKS = [
  { value: 0.75, label: "75% of skills (minimum)" },
  { value: 0.8, label: "80% of skills" },
  { value: 0.85, label: "85% of skills" },
  { value: 0.9, label: "90% of skills" },
  { value: 0.95, label: "95% of skills" },
  { value: 1, label: "Every skill" },
] as const;
const DEFAULT_PASS_MARK = 0.75;
const GRADE_PROGRESS_SUBJECTS: ReadonlyArray<GradeProgress["subject"]> = [
  "ELA",
  "MATH",
];

const REVIEW_GRADES: ReadonlyArray<{ value: ReviewGrade; label: string }> = [
  { value: "K", label: "Kindergarten" },
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
];

function learningPath(purpose: LearningPurpose): string {
  if (purpose === "adultScored") return "/learning/adult-scored";
  return purpose === "gradeReview"
    ? "/learning/grade-review"
    : `/learning/${purpose}`;
}

function gradeName(grade: string | undefined): string {
  if (grade === "GRADE_2") return "Grade 2";
  return grade === "GRADE_1" ? "Grade 1" : "Kindergarten";
}

function learningGrade(grade: string | undefined): "K" | "1" | "2" {
  if (grade === "GRADE_2") return "2";
  return grade === "GRADE_1" ? "1" : "K";
}

function placementGradeName(grade: string): string {
  if (grade === "2" || grade === "GRADE_2") return "Grade 2";
  if (grade === "1" || grade === "GRADE_1") return "Grade 1";
  return "Kindergarten";
}

function masteryLabel(
  state: string | undefined,
  attempts: ProgressAttempt[],
): string {
  const hasPractice = attempts.some((attempt) =>
    ["learning", "practice", "review"].includes(attempt.purpose),
  );
  if (
    !hasPractice &&
    attempts.some(
      (attempt) =>
        attempt.purpose === "diagnostic" || attempt.purpose === "placement",
    )
  )
    return "Diagnostic checked";
  if (
    !hasPractice &&
    attempts.some((attempt) => attempt.purpose === "adultScored")
  )
    return "Adult observation recorded";
  if (state === "mastered") return "Mastered";
  if (state === "reviewDue") return "Review due";
  if (state === "practicing") return "Practicing";
  if (state === "learning") return "Learning";
  return "Ready for practice";
}

function PlacementSummary({
  placement,
  title,
}: {
  placement: PlacementResult;
  title: string;
}): JSX.Element {
  const isReview = placement.assessmentKind === "gradeReview";
  const isGradeCheck = isReview || placement.assessmentKind === "diagnostic";
  const secureSkills = placement.demonstratedStrengths?.length;
  const targetCount = placement.learningTargetIds.length;
  return (
    <section className="level-panel my-5 rounded-2xl p-5" aria-live="polite">
      <p className="learning-step text-xs font-black tracking-[.16em]">
        {title.toUpperCase()}
      </p>
      <h2 className="!mb-2 !mt-1 !text-2xl">{placement.grouping}</h2>
      {isGradeCheck ? (
        <p>
          <strong>{placementGradeName(placement.grade)}</strong>
          {typeof placement.standardsAssessed === "number" &&
          typeof secureSkills === "number"
            ? ` · ${secureSkills} of ${placement.standardsAssessed} skills secure`
            : ""}
        </p>
      ) : (
        <p>
          Recommended starting level:{" "}
          <strong>{placementGradeName(placement.grade)}</strong>
        </p>
      )}
      {placement.placementConfidence && (
        <p>
          {isGradeCheck ? "Evidence confidence" : "Placement confidence"}:{" "}
          <strong>{placement.placementConfidence.toLowerCase()}</strong>
          {typeof placement.totalItems === "number"
            ? ` · ${placement.totalItems} learning checks`
            : ""}
        </p>
      )}
      {isReview && (
        <p>
          This review does not change the student&apos;s level. Skills to
          revisit are added to the practice plan.
        </p>
      )}
      <p>
        {isReview
          ? targetCount > 0
            ? `${targetCount} skill ${targetCount === 1 ? "area" : "areas"} to revisit.`
            : "No gaps were found in this review."
          : targetCount > 0
            ? `${targetCount} skill ${targetCount === 1 ? "area is" : "areas are"} ready for focused practice.`
            : "No priority gaps were found in this check. Regular practice will build and confirm mastery."}
      </p>
      {targetCount > 0 && (
        <details className="mt-3">
          <summary>
            {isReview ? "See skills to revisit" : "See skills to practice"}
          </summary>
          <ul className="mt-2 list-disc pl-6">
            {placement.learningTargetIds.map((standardId) => (
              <li key={standardId}>{standardId}</li>
            ))}
          </ul>
        </details>
      )}
      {placement.strandPlacements && placement.strandPlacements.length > 0 && (
        <details className="mt-3">
          <summary>
            {isGradeCheck ? "See skill-area results" : "See skill-area placement"}
          </summary>
          <ul className="mt-2 list-disc pl-6">
            {placement.strandPlacements.map((strand) => (
              <li key={strand.domain}>
                <strong>{strand.label}:</strong>{" "}
                {isGradeCheck
                  ? ""
                  : `${placementGradeName(strand.instructionalGrade)} · `}
                {strand.status === "ready"
                  ? "ready"
                  : strand.status === "unresolved"
                    ? "more evidence needed"
                    : "focused practice recommended"}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function groupAttempts(
  attempts: ProgressAttempt[],
): Array<[string, ProgressAttempt[]]> {
  return Object.entries(
    attempts.reduce<Record<string, ProgressAttempt[]>>((all, attempt) => {
      all[attempt.primaryStandardId] = [
        ...(all[attempt.primaryStandardId] ?? []),
        attempt,
      ];
      return all;
    }, {}),
  );
}

function SkillProgressCards({
  groups,
  mastery,
  isDiagnostic = false,
}: {
  groups: Array<[string, ProgressAttempt[]]>;
  mastery: Progress["mastery"];
  isDiagnostic?: boolean;
}): JSX.Element {
  return (
    <div className="progress-grid">
      {groups.map(([standardId, attempts]) => {
        const correct = attempts.filter((attempt) => attempt.correct).length;
        const independent = attempts.filter(
          (attempt) => attempt.independent && !attempt.usedHint,
        ).length;
        return (
          <article key={standardId}>
            <strong>{standardId}</strong>
            <span>
              {attempts.length} {isDiagnostic ? "checked" : "practice"}{" "}
              {attempts.length === 1 ? "answer" : "answers"} ·{" "}
              {Math.round((correct / attempts.length) * 100)}% correct
            </span>
            <span>
              {independent} independent · {attempts.length - independent}{" "}
              supported
            </span>
            <b>
              {isDiagnostic
                ? "Diagnostic checked"
                : masteryLabel(
                    mastery.find((item) => item.standardId === standardId)
                      ?.state,
                    attempts,
                  )}
            </b>
          </article>
        );
      })}
    </div>
  );
}

function LessonActivitySection({
  title,
  activity,
}: {
  title: string;
  activity: LessonPlanActivity;
}): JSX.Element {
  return (
    <section className="lesson-activity">
      <h3>
        {title} <span>{activity.minutes} min</span>
      </h3>
      <ol>
        {activity.directions.map((direction) => (
          <li key={direction}>{direction}</li>
        ))}
      </ol>
    </section>
  );
}

function LessonPlanScreen({
  plan,
  onBack,
}: {
  plan: LessonPlanView;
  onBack: () => void;
}): JSX.Element {
  const spokenOverview = `${plan.title}. ${plan.summary}. This lesson has ${plan.days.length} days. Day 1: ${plan.days[0]?.objective ?? ""}`;
  return (
    <section className="learning-question lesson-plan">
      <button className="secondary lesson-back" onClick={onBack}>
        Back to learning
      </button>
      <p className="eyebrow">
        GUIDED LESSON ·{" "}
        {plan.grade === "K" ? "KINDERGARTEN" : `GRADE ${plan.grade}`}{" "}
        {plan.subject.toUpperCase()}
      </p>
      <div className="prompt">
        <h1>{plan.title}</h1>
        <button
          className="speaker-button"
          onClick={() => void speak(spokenOverview)}
          aria-label="Listen to lesson overview"
        >
          🔊
        </button>
      </div>
      <p className="learning-card-note">{plan.summary}</p>
      <section
        className="lesson-materials"
        aria-labelledby="lesson-materials-heading"
      >
        <h2 id="lesson-materials-heading">Get ready</h2>
        <ul>
          {plan.materials.map((material) => (
            <li key={material.name}>
              <strong>{material.name}</strong>
              {material.alternatives.length > 0 && (
                <span> Try: {material.alternatives.join(", ")}.</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="lesson-days-heading">
        <h2 id="lesson-days-heading">Your five-day plan</h2>
        {plan.days.map((day) => (
          <details className="lesson-day" key={day.day} open={day.day === 1}>
            <summary>
              <span>DAY {day.day}</span>
              <strong>{day.title}</strong>
              <small>{day.objective}</small>
            </summary>
            <div className="lesson-day-content">
              <p>
                <strong>Adult setup:</strong> {day.adultSetup.join(" ")}
              </p>
              <p>
                <strong>Book or text idea:</strong> {day.textRecommendation}
              </p>
              <LessonActivitySection title="Warm-up" activity={day.warmUp} />
              <LessonActivitySection
                title="Model it together"
                activity={day.explicitModel}
              />
              <LessonActivitySection
                title="Practice together"
                activity={day.guidedPractice}
              />
              <LessonActivitySection
                title={`Independent practice · ${day.independentPractice.itemCount} questions`}
                activity={day.independentPractice}
              />
              <LessonActivitySection
                title="Try more"
                activity={day.extension}
              />
              <LessonActivitySection
                title="If it feels tricky"
                activity={day.reteach}
              />
              <section className="lesson-activity">
                <h3>Look for</h3>
                <ul>
                  {day.masteryEvidence.map((evidence) => (
                    <li key={evidence}>{evidence}</li>
                  ))}
                </ul>
              </section>
            </div>
          </details>
        ))}
      </section>
      <details className="lesson-accommodations">
        <summary>Accessibility and accommodations</summary>
        <ul>
          {plan.accessibility.accommodationNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
      <button className="secondary lesson-back" onClick={onBack}>
        Back to learning
      </button>
    </section>
  );
}

type SubjectDetails = {
  label: string;
  icon: string;
  /** Label for the adult-guided activity that starts from the parent tools. */
  adultActivity: string;
  /** Short note shown above the start buttons. */
  activityNote: string;
};

const SUBJECT_ORDER: readonly LearningSubject[] = [
  "ELA",
  "MATH",
  "SCIENCE",
  "SOCIAL_STUDIES",
  "HEALTH",
  "PHYSICAL_EDUCATION",
  "FINE_ARTS",
  "COMPUTER_SCIENCE",
  "INFORMATION_LITERACY",
];

const SUBJECT_DETAILS: Record<LearningSubject, SubjectDetails> = {
  ELA: {
    label: "Reading & Language",
    icon: "Aa",
    adultActivity: "Adult-scored ELA",
    activityNote:
      "Practice follows a small set of next skills. A diagnostic finds the best place to focus next.",
  },
  MATH: {
    label: "Math",
    icon: "1+2",
    adultActivity: "Hands-on math activity",
    activityNote:
      "Practice follows a small set of next number skills. Hands-on activities with an adult build mathematical reasoning with real objects and drawings.",
  },
  SCIENCE: {
    label: "Science",
    icon: "✦",
    adultActivity: "Science investigation",
    activityNote:
      "Oklahoma science is learned through hands-on investigations with an adult.",
  },
  SOCIAL_STUDIES: {
    label: "Social Studies",
    icon: "⌂",
    adultActivity: "Social studies inquiry",
    activityNote:
      "Oklahoma social studies is learned through conversations, maps, sources, and real-life inquiry with an adult.",
  },
  HEALTH: {
    label: "Health",
    icon: "♥",
    adultActivity: "Health activity",
    activityNote:
      "Oklahoma health is learned through safe, age-appropriate conversations and everyday healthy routines with an adult.",
  },
  PHYSICAL_EDUCATION: {
    label: "Physical Education",
    icon: "↟",
    adultActivity: "Movement activity",
    activityNote:
      "Physical education is guided movement. Choose a clear, safe space and complete each activity with an adult.",
  },
  FINE_ARTS: {
    label: "Fine Arts",
    icon: "✎",
    adultActivity: "Fine arts activity",
    activityNote:
      "Fine arts uses making, performing, noticing, and reflecting across dance, drama, media arts, music, and visual art with an adult.",
  },
  COMPUTER_SCIENCE: {
    label: "Computer Science",
    icon: "⌘",
    adultActivity: "Computer science activity",
    activityNote:
      "Computer science uses safe hands-on and unplugged investigations of data, algorithms, programming, networks, and computing systems with an adult.",
  },
  INFORMATION_LITERACY: {
    label: "Information Literacy",
    icon: "⌕",
    adultActivity: "Information literacy inquiry",
    activityNote:
      "Information literacy uses books, people, libraries, and safe supervised digital tools to ask questions, research, organize ideas, and share learning.",
  },
};

/** Subjects that are taught and scored with an adult rather than practiced on screen. */
const ADULT_OBSERVED_ONLY_SUBJECTS: readonly LearningSubject[] = [
  "SCIENCE",
  "SOCIAL_STUDIES",
  "HEALTH",
  "PHYSICAL_EDUCATION",
  "FINE_ARTS",
  "COMPUTER_SCIENCE",
  "INFORMATION_LITERACY",
];

function LearningDashboard({
  student,
  selectedSubject,
  setSelectedSubject,
  isLoading,
  proctorCode,
  setProctorCode,
  placementGrade,
  setPlacementGrade,
  reviewGrade,
  setReviewGrade,
  passMark,
  setPassMark,
  resumableAssessment,
  resumeAssessment,
  start,
  updatePlacement,
  lessonPlan,
  openLesson,
  error,
}: {
  student: StudentSession["student"] | undefined;
  selectedSubject: LearningSubject;
  setSelectedSubject: (subject: LearningSubject) => void;
  isLoading: boolean;
  proctorCode: string;
  setProctorCode: (code: string) => void;
  placementGrade: LearningLevel;
  setPlacementGrade: (grade: LearningLevel) => void;
  reviewGrade: ReviewGrade;
  setReviewGrade: (grade: ReviewGrade) => void;
  passMark: number;
  setPassMark: (passMark: number) => void;
  resumableAssessment: ResumableLearningSession | null;
  resumeAssessment: () => void;
  start: (purpose: LearningPurpose, gradeOverride?: ReviewGrade) => Promise<void>;
  updatePlacement: () => Promise<void>;
  lessonPlan: LessonPlanView | null;
  openLesson: (lessonPlanId: string) => void;
  error: string | null;
}): JSX.Element {
  const subject = SUBJECT_DETAILS[selectedSubject];
  const isAdultObservedOnly =
    ADULT_OBSERVED_ONLY_SUBJECTS.includes(selectedSubject);
  const selectedLevel =
    student?.curriculumLevels?.[selectedSubject] ?? student?.grade;
  const roadmap = coreCourseRoadmap(
    selectedSubject,
    learningGrade(selectedLevel),
  );
  const currentGradeIndex = REVIEW_GRADES.findIndex(
    (grade) => grade.value === learningGrade(selectedLevel),
  );
  const earlierGrades = REVIEW_GRADES.slice(0, Math.max(currentGradeIndex, 0));
  const supportsGradeReview =
    selectedSubject === "ELA" || selectedSubject === "MATH";
  const effectiveReviewGrade = earlierGrades.some(
    (grade) => grade.value === reviewGrade,
  )
    ? reviewGrade
    : (earlierGrades[earlierGrades.length - 1]?.value ?? reviewGrade);
  const savedActivityName =
    resumableAssessment?.mode === "practice" ? "lesson" : "learning check";
  const resumeName =
    resumableAssessment?.mode === "practice"
      ? "lesson"
      : resumableAssessment?.mode === "placement"
        ? "placement"
        : resumableAssessment?.mode === "gradeReview"
          ? "review"
          : "diagnostic";

  return (
    <section className="learning-dashboard">
      <div className="dash-intro">
        <p className="eyebrow">Oklahoma-aligned learning</p>
        <h1>Ready to learn something new?</h1>
        <p className="dash-lede">
          Choose one subject, then begin a focused activity at your current
          level.
        </p>
      </div>

      <div className="dash-grid">
        <section
          aria-labelledby="subject-heading"
          className="dash-card dash-subjects"
        >
          <div className="section-head">
            <div>
              <p className="learning-step">Step 1</p>
              <h2 id="subject-heading">Choose a subject</h2>
            </div>
            <span className="learning-card-note">
              You can learn at a different level in each subject.
            </span>
          </div>
          <div className="subject-grid">
            {SUBJECT_ORDER.map((subjectId) => {
              const details = SUBJECT_DETAILS[subjectId];
              return (
                <button
                  className="subject-tile"
                  data-subject={subjectId}
                  key={subjectId}
                  onClick={() => setSelectedSubject(subjectId)}
                  aria-pressed={selectedSubject === subjectId}
                >
                  <span aria-hidden="true" className="subject-icon">
                    {details.icon}
                  </span>
                  <span>
                    <span className="subject-name">{details.label}</span>
                    <span className="subject-level">
                      {gradeName(
                        student?.curriculumLevels?.[subjectId] ?? student?.grade,
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside aria-labelledby="activity-heading" className="dash-session">
          <p className="learning-step">Step 2</p>
          <h2 id="activity-heading">Start your activity</h2>
          <div className="session-subject">
            <span
              aria-hidden="true"
              className="subject-icon"
              data-subject={selectedSubject}
            >
              {subject.icon}
            </span>
            <span>
              <span className="session-subject-name">{subject.label}</span>
              <span className="session-subject-level">
                {gradeName(selectedLevel)}
              </span>
            </span>
          </div>
          <p className="learning-card-note session-intro">
            {subject.activityNote}
          </p>
          {resumableAssessment && (
            <div className="level-panel" role="status">
              <strong>Your {savedActivityName} is saved</strong>
              <p className="learning-card-note">
                Continue with activity {resumableAssessment.session.position + 1}{" "}
                right where you stopped.
              </p>
              <button disabled={isLoading} onClick={resumeAssessment}>
                Resume {resumeName} <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
          {isAdultObservedOnly ? (
            <p className="session-note">
              Begin this subject from Parent &amp; teacher tools below. It
              needs your verification code.
            </p>
          ) : (
            <>
              <div className="session-actions">
                <button
                  disabled={isLoading}
                  onClick={() => void start("practice")}
                >
                  Start practice
                </button>
                <button
                  className="secondary"
                  disabled={isLoading}
                  onClick={() => void start("diagnostic")}
                >
                  {resumableAssessment
                    ? "Start new grade diagnostic"
                    : "Start grade diagnostic"}
                </button>
              </div>
              <label className="pass-mark">
                Pass mark for diagnostics and reviews
                <select
                  value={passMark}
                  onChange={(event) => setPassMark(Number(event.target.value))}
                >
                  {PASS_MARKS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="session-note">
                <strong>For current students.</strong> The grade diagnostic
                checks every skill in {gradeName(selectedLevel)} to show how
                the student is doing and how close they are to the next grade.
                It never goes back to earlier grades. Students new to the app
                start with New-student placement in Parent &amp; teacher tools
                instead. The diagnostic asks about each skill
                at least twice, with a few more activities when an answer
                pattern is unclear. It is a long check, so take breaks and
                continue later.
              </p>
            </>
          )}
        </aside>

        {lessonPlan && (
          <section
            aria-labelledby="guided-lesson-heading"
            className="dash-card dash-lesson"
          >
            <p className="learning-step">Guided lesson</p>
            <h2 id="guided-lesson-heading">{lessonPlan.title}</h2>
            <p className="learning-card-note">{lessonPlan.summary}</p>
            <button className="secondary" onClick={() => openLesson(lessonPlan.id)}>
              Open {lessonPlan.days.length}-day lesson
            </button>
          </section>
        )}

        {roadmap && (
          <section
            aria-labelledby="roadmap-heading"
            className="dash-card dash-roadmap"
          >
            <p className="learning-step">Your roadmap</p>
            <h2 id="roadmap-heading">{roadmap.title}</h2>
            <p className="learning-card-note">{roadmap.introduction}</p>
            <ol className="roadmap-list" role="list">
              {roadmap.units.map((unit, index) => (
                <li className="roadmap-unit" key={unit.title}>
                  <span aria-hidden="true" className="unit-num">
                    {index + 1}
                  </span>
                  <span>
                    <span className="unit-title">{unit.title}</span>
                    <span className="unit-focus">{unit.focus}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <details className="adult-tools">
          <summary>
            <span>
              <span className="tools-title">Parent &amp; teacher tools</span>
              <span className="tools-subtitle">
                Placement, reviews, proctored checks, and levels
              </span>
            </span>
          </summary>
          <div className="adult-tools-content">
            <p className="learning-card-note">
              These tools require an adult verification code and should be
              completed with the student.
            </p>
            {!isAdultObservedOnly && (
              <p className="learning-card-note">
                <strong>New-student placement</strong> is for a student who is
                new to the app. It samples skills from Kindergarten upward to
                find a starting grade, and is usually taken once. Current
                students use the <strong>grade diagnostic</strong> instead,
                which checks every skill in their grade.
              </p>
            )}
            <label>
              Verification code
              <input
                value={proctorCode}
                onChange={(event) => setProctorCode(event.target.value)}
                inputMode="numeric"
                type="password"
                autoComplete="one-time-code"
              />
            </label>
            <div className="tool-actions">
              {!isAdultObservedOnly && (
                <button
                  className="secondary"
                  disabled={isLoading || !proctorCode}
                  onClick={() => void start("placement")}
                >
                  New-student placement
                </button>
              )}
              {!isAdultObservedOnly && (
                <button
                  className="secondary"
                  disabled={isLoading || !proctorCode}
                  onClick={() => void start("proctored")}
                >
                  Proctored check
                </button>
              )}
              <button
                className="secondary"
                disabled={isLoading || !proctorCode}
                onClick={() => void start("adultScored")}
              >
                {subject.adultActivity}
              </button>
            </div>
            {supportsGradeReview && (
              <div className="level-panel">
                <h3>Review earlier grade material</h3>
                <p className="learning-card-note">
                  A one-time check of an earlier grade in {subject.label}. It
                  does not change the student&apos;s level, and any skills that
                  need work are added to the practice plan.
                </p>
                {earlierGrades.length > 0 ? (
                  <div className="level-row">
                    <label>
                      Grade to review
                      <select
                        value={effectiveReviewGrade}
                        onChange={(event) =>
                          setReviewGrade(event.target.value as ReviewGrade)
                        }
                      >
                        {earlierGrades.map((grade) => (
                          <option key={grade.value} value={grade.value}>
                            {grade.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="secondary"
                      disabled={isLoading || !proctorCode}
                      onClick={() =>
                        void start("gradeReview", effectiveReviewGrade)
                      }
                    >
                      Start review
                    </button>
                  </div>
                ) : (
                  <p className="learning-card-note">
                    There is no earlier grade to review in this subject.
                  </p>
                )}
              </div>
            )}
            <div className="level-panel">
              <h3>Set subject level</h3>
              <div className="level-row">
                <label>
                  Level for {subject.label}
                  <select
                    value={placementGrade}
                    onChange={(event) =>
                      setPlacementGrade(event.target.value as LearningLevel)
                    }
                  >
                    <option value="K">Kindergarten</option>
                    <option value="GRADE_1">Grade 1</option>
                    <option value="GRADE_2">Grade 2</option>
                  </select>
                </label>
                <button
                  className="secondary"
                  disabled={!proctorCode}
                  onClick={() => void updatePlacement()}
                >
                  Save level
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>

      {error && (
        <p className="feedback" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export function LearningApp(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentSession, setStudentSession] = useState<StudentSession | null>(
    () => loadStudentSession(),
  );
  const student = studentSession?.student;
  const hasAuthenticatedStudent = Boolean(
    studentSession && !studentSession.demo,
  );
  const curriculumSubject = useState<LearningSubject>("ELA");
  const selectedSubject = curriculumSubject[0];
  const setSelectedSubject = curriculumSubject[1];
  const curriculumGrade = learningGrade(
    student?.curriculumLevels?.[selectedSubject] ?? student?.grade,
  );
  const [session, setSession] = useState<SessionView | null>(null);
  const [resumableAssessment, setResumableAssessment] =
    useState<ResumableLearningSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [classification, setClassification] = useState<Classification>({});
  const [sequenceAnswer, setSequenceAnswer] = useState<string[]>([]);
  const [adultChecks, setAdultChecks] = useState<string[]>([]);
  const [adultEvidence, setAdultEvidence] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const isAdvancingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [proctorCode, setProctorCode] = useState("");
  const [placementGrade, setPlacementGrade] = useState<LearningLevel>("K");
  const [reviewGrade, setReviewGrade] = useState<ReviewGrade>("K");
  const [passMark, setPassMark] = useState<number>(DEFAULT_PASS_MARK);
  const [progress, setProgress] = useState<Progress>({
    attempts: [],
    mastery: [],
    skillProgress: [],
    latestDiagnosticPlacement: null,
    latestAssessmentSessionId: null,
  });
  const [lessonPlans, setLessonPlans] = useState<LessonPlanView[]>([]);
  const isQuestion =
    location.pathname === "/learning/practice" ||
    location.pathname === "/learning/diagnostic" ||
    location.pathname === "/learning/placement" ||
    location.pathname === "/learning/grade-review" ||
    location.pathname === "/learning/proctored" ||
    location.pathname === "/learning/adult-scored";
  const activeLessonId =
    location.pathname.match(/^\/learning\/lessons\/([a-z0-9._-]+)$/)?.[1] ??
    null;
  const activeLessonPlan = activeLessonId
    ? (lessonPlans.find((plan) => plan.id === activeLessonId) ?? null)
    : null;
  const selectedLessonPlan =
    lessonPlans.find(
      (plan) =>
        plan.grade === curriculumGrade &&
        plan.subject === selectedSubject.toLowerCase(),
    ) ?? null;
  const sorting = classificationData(session);
  const sequence = sequenceData(session);
  const choices = session?.question.interaction.choices ?? [];
  const hasPhonemeChoices = isPhonemeChoiceQuestion(session, choices);
  const adultChecklist = session?.question.interaction.adultChecklist ?? [];
  const adultObservationNotes = progress.attempts.flatMap((attempt) => {
    const note =
      attempt.purpose === "adultScored"
        ? adultEvidenceNote(attempt.submittedAnswer)
        : null;
    return note ? [{ standardId: attempt.primaryStandardId, note }] : [];
  });
  const currentGradeProgress = GRADE_PROGRESS_SUBJECTS.flatMap((subject) =>
    (progress.gradeProgress ?? []).filter(
      (item) =>
        item.subject === subject &&
        item.grade ===
          learningGrade(student?.curriculumLevels?.[subject] ?? student?.grade),
    ),
  );
  const latestDiagnosticProgress = groupAttempts(
    progress.attempts.filter(
      (attempt) => attempt.sessionId === progress.latestAssessmentSessionId,
    ),
  );
  const practiceProgress = groupAttempts(
    progress.attempts.filter(
      (attempt) =>
        attempt.purpose !== "diagnostic" &&
        attempt.purpose !== "placement" &&
        attempt.purpose !== "gradeReview",
    ),
  );
  const canSubmit = sorting
    ? sorting.items.every((item) => Boolean(classification[item]))
    : sequence
      ? sequenceAnswer.length === sequence.length
      : Boolean(selectedAnswer);
  const completedDiagnosticQuestions = session
    ? Math.min(session.position + (result ? 1 : 0), session.length)
    : 0;

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (!isQuestion || !hasAuthenticatedStudent) return;
    let isActive = true;
    setIsLoadingSession(true);
    void learningApplication
      .restore()
      .then((restored) => {
        if (isActive) setSession(restored);
      })
      .catch((reason) => {
        if (isActive)
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to restore your learning session.",
          );
      })
      .finally(() => {
        if (isActive) setIsLoadingSession(false);
      });
    return () => {
      isActive = false;
    };
  }, [hasAuthenticatedStudent, isQuestion]);
  useEffect(() => {
    if (location.pathname !== "/learning" || !hasAuthenticatedStudent) return;
    let isActive = true;
    void learningApplication.resumableSession().then((saved) => {
      if (!isActive) return;
      setResumableAssessment(saved);
      if (saved?.subject) setSelectedSubject(saved.subject);
    });
    return () => {
      isActive = false;
    };
  }, [hasAuthenticatedStudent, location.pathname, setSelectedSubject]);
  useEffect(() => {
    if (location.pathname === "/learning/progress" && hasAuthenticatedStudent) {
      void learningApplication
        .progress()
        .then(setProgress)
        .catch(() => setError("Progress is temporarily unavailable."));
    }
  }, [hasAuthenticatedStudent, location.pathname]);
  useEffect(() => {
    if (!hasAuthenticatedStudent) return;
    let isActive = true;
    void learningApplication
      .lessonPlans()
      .then((plans) => {
        if (isActive) setLessonPlans(plans);
      })
      .catch(() => {
        if (isActive)
          setError("Guided lesson plans are temporarily unavailable.");
      });
    return () => {
      isActive = false;
    };
  }, [hasAuthenticatedStudent]);

  const resetQuestionState = () => {
    isAdvancingRef.current = false;
    setIsAdvancing(false);
    setSelectedAnswer("");
    setClassification({});
    setSequenceAnswer([]);
    setAdultChecks([]);
    setAdultEvidence("");
    setUsedHint(false);
    setResult(null);
    setIsListening(false);
  };
  const start = async (
    purpose:
      | "practice"
      | "diagnostic"
      | "placement"
      | "gradeReview"
      | "proctored"
      | "adultScored",
    gradeOverride?: ReviewGrade,
  ) => {
    try {
      setIsLoadingSession(true);
      const next = await learningApplication.start(
        purpose,
        purpose === "proctored" ||
          purpose === "adultScored" ||
          purpose === "placement" ||
          purpose === "gradeReview"
          ? proctorCode
          : undefined,
        gradeOverride ?? curriculumGrade,
        selectedSubject,
        purpose === "diagnostic" || purpose === "gradeReview"
          ? passMark
          : undefined,
      );
      setSession(next);
      setResumableAssessment(null);
      resetQuestionState();
      setError(null);
      navigate(learningPath(purpose));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to start learning.",
      );
    } finally {
      setIsLoadingSession(false);
    }
  };
  const submit = async (
    submittedAnswer: unknown = sorting
      ? classification
      : sequence
        ? sequenceAnswer
        : selectedAnswer,
  ) => {
    if (!session) return;
    try {
      setError(null);
      setResult(
        await learningApplication.submit(
          session.sessionId,
          submittedAnswer,
          usedHint,
        ),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to save your answer.",
      );
    }
  };
  const listenForAnswer = () => {
    const recognitionWindow = window as typeof window & {
      SpeechRecognition?: BrowserRecognitionConstructor;
      webkitSpeechRecognition?: BrowserRecognitionConstructor;
    };
    const SpeechRecognition =
      recognitionWindow.SpeechRecognition ??
      recognitionWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice answers are not available in this browser.");
      return;
    }
    stopSpeaking();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setIsListening(false);
      if (transcript) void submit(answerFromTranscript(transcript, choices));
    };
    recognition.onerror = () => {
      setIsListening(false);
      setError("I could not hear that. Please try the microphone again.");
    };
    recognition.onend = () => setIsListening(false);
    setError(null);
    setIsListening(true);
    recognition.start();
  };
  const advance = async () => {
    if (!session || isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setIsAdvancing(true);
    try {
      setError(null);
      stopSpeaking();
      const next = await learningApplication.next(session.sessionId);
      if (!next) {
        navigate("/learning/progress");
        return;
      }
      setSession(next);
      resetQuestionState();
    } catch (reason) {
      isAdvancingRef.current = false;
      setIsAdvancing(false);
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to continue your learning session.",
      );
    }
  };
  const resumeAssessmentSession = () => {
    if (!resumableAssessment) return;
    stopSpeaking();
    setSession(resumableAssessment.session);
    setSelectedSubject(resumableAssessment.subject ?? selectedSubject);
    resetQuestionState();
    setError(null);
    navigate(learningPath(resumableAssessment.mode));
  };
  const takeBreak = async () => {
    if (!session) return;
    stopSpeaking();
    try {
      await learningApplication.pause(session);
      navigate("/learning");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Your progress is not saved yet. Please try again.",
      );
    }
  };
  useEffect(() => {
    const canAutoAdvance = Boolean(
      !session?.activity &&
      result &&
      !result.complete &&
      !result.retry &&
      !result.placement,
    );
    if (!canAutoAdvance) return;
    const timeoutId = window.setTimeout(() => {
      void advance();
    }, CORRECT_ANSWER_ADVANCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [result, session?.question.id]);
  const choosePhoneme = (choice: string) => {
    stopSpeaking();
    void submit(choice);
  };
  const completeLessonActivityAndAdvance = async (): Promise<void> => {
    if (!session?.activity) return;
    try {
      setIsAdvancing(true);
      const completion = await learningApplication.completeActivity(
        session.sessionId,
        session.activity.instanceId,
      );
      if (completion.complete) {
        navigate("/learning/progress");
        return;
      }
      await advance();
    } catch (reason) {
      isAdvancingRef.current = false;
      setIsAdvancing(false);
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to save this lesson step.",
      );
    }
  };
  const requestLessonHint = async (
    level?: LessonSupportLevel,
  ): Promise<HintResult> => {
    if (!session?.activity)
      throw new Error("This lesson step is no longer active.");
    const hint = await learningApplication.hint(
      session.sessionId,
      session.activity.instanceId,
      level,
    );
    setSession((current) =>
      current?.activity
        ? {
            ...current,
            activity: {
              ...current.activity,
              highestSupport: hint.highestSupport,
              evidenceMode: hint.evidenceMode,
            },
          }
        : current,
    );
    return hint;
  };
  const openLesson = (lessonPlanId: string) => {
    stopSpeaking();
    setError(null);
    navigate(`/learning/lessons/${lessonPlanId}`);
  };
  const returnToLearning = () => {
    stopSpeaking();
    navigate("/learning");
  };
  const scoreAdult = async (demonstrated: boolean) => {
    if (!session) return;
    try {
      setError(null);
      setResult(
        await learningApplication.scoreAdult(
          session.sessionId,
          demonstrated,
          adultEvidence,
        ),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to save the adult score.",
      );
    }
  };
  const updatePlacement = async () => {
    if (!studentSession || studentSession.demo) return;
    try {
      setError(null);
      const updated = await learningApplication.updateSubjectLevel(
        selectedSubject,
        placementGrade,
        proctorCode,
      );
      const next = {
        ...studentSession,
        student: {
          ...studentSession.student,
          ...updated,
          subjects: updated.subjects as StudentSession["student"]["subjects"],
          curriculumLevels: updated.curriculumLevels,
        },
      };
      saveStudentSession(next);
      setStudentSession(next);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to update this subject level.",
      );
    }
  };

  if (!hasAuthenticatedStudent)
    return (
      <main className="learning-app">
        <section className="learning-shell">
          <section className="learning-empty-state">
            <p className="eyebrow">STUDENT LOGIN REQUIRED</p>
            <h1>Sign in to start Learning</h1>
            <p>
              Your answers, skill progress, and scheduled reviews need a student
              account so they stay with the right learner.
            </p>
            <div className="actions">
              <button
                onClick={() => {
                  stopSpeaking();
                  clearStudentSession();
                  navigate("/lessons");
                }}
              >
                Sign in or create a student
              </button>
              <button className="secondary" onClick={() => navigate("/")}>
                Back to main menu
              </button>
            </div>
          </section>
        </section>
      </main>
    );

  if (activeLessonPlan)
    return <GuidedLessonPlayer plan={activeLessonPlan} onExit={returnToLearning} />;

  return (
    <main className="learning-app">
      <section className="learning-shell">
        <header className="learning-topbar">
          <button
            className="learning-home-button"
            onClick={() => navigate("/")}
          >
            <span aria-hidden="true">←</span> Home
          </button>
          <nav aria-label="Learning navigation">
            <button
              className="learning-nav-button"
              aria-current={location.pathname === "/learning" ? "page" : undefined}
              onClick={() => navigate("/learning")}
            >
              Learning
            </button>
            <button
              className="learning-nav-button"
              aria-current={
                location.pathname === "/learning/progress" ? "page" : undefined
              }
              onClick={() => navigate("/learning/progress")}
            >
              Progress
            </button>
          </nav>
        </header>
        {location.pathname === "/learning" && (
          <LearningDashboard
            student={student}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            isLoading={isLoadingSession}
            proctorCode={proctorCode}
            setProctorCode={setProctorCode}
            placementGrade={placementGrade}
            setPlacementGrade={setPlacementGrade}
            reviewGrade={reviewGrade}
            setReviewGrade={setReviewGrade}
            passMark={passMark}
            setPassMark={setPassMark}
            resumableAssessment={resumableAssessment}
            resumeAssessment={resumeAssessmentSession}
            start={start}
            updatePlacement={updatePlacement}
            lessonPlan={selectedLessonPlan}
            openLesson={openLesson}
            error={error}
          />
        )}
        {activeLessonPlan && (
          <LessonPlanScreen plan={activeLessonPlan} onBack={returnToLearning} />
        )}
        {activeLessonId && !activeLessonPlan && (
          <section className="learning-empty-state">
            <h1>Guided lesson unavailable</h1>
            <p className="feedback">
              This lesson is not available for your account right now. Return to
              Learning and try again.
            </p>
            <button className="secondary" onClick={returnToLearning}>
              Back to learning
            </button>
          </section>
        )}
        {isQuestion && isLoadingSession && !session && (
          <p className="feedback">Loading your learning session…</p>
        )}
        {isQuestion && !isLoadingSession && !session && (
          <section className="learning-empty-state">
            <h1>Choose a learning activity</h1>
            <p className="feedback">
              {error ??
                "This session is no longer available. Start a new one to continue."}
            </p>
            <div className="actions">
              <button
                onClick={() =>
                  void start(
                    location.pathname.endsWith("diagnostic")
                      ? "diagnostic"
                      : "practice",
                  )
                }
              >
                Start new session
              </button>
              <Link className="secondary" to="/learning">
                Back to learning
              </Link>
            </div>
          </section>
        )}
        {isQuestion && session?.activity && (
          <>
            {result?.correct && result.celebrate && (
              <CorrectAnswerConfetti burstKey={session.activity.instanceId} />
            )}
            <KindergartenLessonActivity
              activity={session.activity}
              position={session.position}
              length={session.length}
              result={result}
              isBusy={isAdvancing}
              onSubmit={async (answer) => {
                await submit(answer);
              }}
              onCompleteAndNext={completeLessonActivityAndAdvance}
              onNext={async () => {
                await advance();
              }}
              onHint={requestLessonHint}
              onTakeBreak={takeBreak}
            />
            {error && (
              <p className="feedback" role="alert">
                {error}
              </p>
            )}
          </>
        )}
        {isQuestion && session && !session.activity && (
          <section className="learning-question">
            {result?.correct && (
              <CorrectAnswerConfetti burstKey={session.question.id} />
            )}
            <p className="eyebrow">
              {location.pathname === "/learning/adult-scored"
                ? selectedSubject === "MATH"
                  ? "HANDS-ON MATH ACTIVITY"
                  : selectedSubject === "SCIENCE"
                    ? "SCIENCE INVESTIGATION"
                    : selectedSubject === "SOCIAL_STUDIES"
                      ? "SOCIAL STUDIES INQUIRY"
                      : selectedSubject === "HEALTH"
                        ? "HEALTH ACTIVITY"
                        : selectedSubject === "PHYSICAL_EDUCATION"
                          ? "MOVEMENT ACTIVITY"
                          : selectedSubject === "FINE_ARTS"
                            ? "FINE ARTS ACTIVITY"
                            : selectedSubject === "COMPUTER_SCIENCE"
                              ? "COMPUTER SCIENCE ACTIVITY"
                              : selectedSubject === "INFORMATION_LITERACY"
                                ? "INFORMATION LITERACY INQUIRY"
                                : "ADULT-SCORED ELA CHECK"
                : session.assessmentStage
                  ? location.pathname === "/learning/grade-review"
                    ? `${placementGradeName(session.assessmentStage.grade).toUpperCase()} REVIEW · ${completedDiagnosticQuestions} / ${session.length} COMPLETED`
                    : location.pathname === "/learning/diagnostic"
                      ? `${placementGradeName(session.assessmentStage.grade).toUpperCase()} LEARNING CHECK · ${completedDiagnosticQuestions} / ${session.length} COMPLETED`
                      : `${placementGradeName(session.assessmentStage.grade).toUpperCase()} LEARNING CHECK · ACTIVITY ${session.position + 1}`
                  : `QUESTION ${session.position + 1} OF ${session.length}`}
            </p>
            {session.assessmentStage && !result && (
              <button className="secondary" onClick={() => void takeBreak()}>
                Take a break
              </button>
            )}
            {session.question.interaction.visual && (
              <div
                className="learning-visual"
                role="img"
                aria-label={`${session.question.interaction.visual.count} stars`}
              >
                {session.question.interaction.visual.count > 0 ? (
                  "★".repeat(session.question.interaction.visual.count)
                ) : (
                  <span className="empty-visual">No stars</span>
                )}
              </div>
            )}
            <div className="prompt">
              <h1>{session.question.prompt.text}</h1>
              <button
                className="speaker-button"
                onClick={() =>
                  void speak(
                    session.question.accessibility.spokenPrompt ??
                      session.question.prompt.text,
                  )
                }
                aria-label="Replay question"
              >
                🔊
              </button>
            </div>
            {session.question.prompt.instructions && (
              <p className="question-instructions">
                {session.question.prompt.instructions}
              </p>
            )}
            {session.question.interaction.learningTip &&
              !result &&
              location.pathname !== "/learning/adult-scored" && (
                <details
                  className="learning-tip"
                  onToggle={(event) => {
                    if (event.currentTarget.open) setUsedHint(true);
                  }}
                >
                  <summary>Need a hint?</summary>
                  <p>{session.question.interaction.learningTip}</p>
                </details>
              )}
            {location.pathname === "/learning/adult-scored" && !result ? (
              <section className="adult-score">
                <p>
                  Adult: observe the student complete this activity, then record
                  the result.
                </p>
                {adultChecklist.length > 0 && (
                  <fieldset className="adult-checklist">
                    <legend>Before recording a result, check each item.</legend>
                    {adultChecklist.map((item, index) => (
                      <label className="check" key={item}>
                        <input
                          type="checkbox"
                          checked={adultChecks.includes(String(index))}
                          onChange={() =>
                            setAdultChecks((current) =>
                              current.includes(String(index))
                                ? current.filter(
                                    (value) => value !== String(index),
                                  )
                                : [...current, String(index)],
                            )
                          }
                        />{" "}
                        {item}
                      </label>
                    ))}
                  </fieldset>
                )}
                <label className="adult-evidence-label">
                  Observation note <span>(optional)</span>
                  <textarea
                    value={adultEvidence}
                    onChange={(event) => setAdultEvidence(event.target.value)}
                    maxLength={1000}
                    placeholder="What did the student show, say, make, read, or write?"
                  />
                </label>
                <div className="actions">
                  <button
                    disabled={
                      adultChecklist.length > 0 &&
                      adultChecks.length !== adultChecklist.length
                    }
                    onClick={() => void scoreAdult(true)}
                  >
                    Skill demonstrated
                  </button>
                  <button
                    className="secondary"
                    onClick={() => void scoreAdult(false)}
                  >
                    Keep practicing
                  </button>
                </div>
              </section>
            ) : sorting ? (
              <section
                className="classification-answer"
                aria-label="Letter sorting activity"
              >
                {sorting.items.map((item) => (
                  <div className="classification-item" key={item}>
                    <strong>{item}</strong>
                    <div>
                      {sorting.categories.map((category) => (
                        <button
                          aria-pressed={classification[item] === category}
                          className={
                            classification[item] === category
                              ? "selected"
                              : "secondary"
                          }
                          disabled={Boolean(result)}
                          key={category}
                          onClick={() =>
                            setClassification((current) => ({
                              ...current,
                              [item]: category,
                            }))
                          }
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ) : sequence ? (
              <section
                className="sequence-answer"
                aria-label="Number ordering activity"
              >
                <div className="answer-options">
                  {sequence.map((item) => {
                    const position = sequenceAnswer.indexOf(item);
                    return (
                      <button
                        className={position >= 0 ? "selected" : "secondary"}
                        disabled={Boolean(result) || position >= 0}
                        key={item}
                        onClick={() =>
                          setSequenceAnswer((current) => [...current, item])
                        }
                      >
                        {position >= 0 ? `${position + 1}. ${item}` : item}
                      </button>
                    );
                  })}
                </div>
                {sequenceAnswer.length > 0 && !result && (
                  <button
                    className="secondary"
                    onClick={() =>
                      setSequenceAnswer((current) => current.slice(0, -1))
                    }
                  >
                    Undo last
                  </button>
                )}
              </section>
            ) : hasPhonemeChoices ? (
              <section
                className="phoneme-choice-answer"
                aria-label="Sound answer choices"
              >
                <p>Listen to each sound, then choose one.</p>
                <div>
                  {choices.map((choice) => (
                    <button
                      className="phoneme-choice-button"
                      disabled={Boolean(result)}
                      key={choice.id}
                      onPointerEnter={() =>
                        void speak(phonemeChoiceAudio(choice.label))
                      }
                      onFocus={() =>
                        void speak(phonemeChoiceAudio(choice.label))
                      }
                      onClick={() => choosePhoneme(choice.label)}
                      aria-label={`Choose ${choice.label}`}
                    >
                      <span aria-hidden="true">🔊</span>
                      <strong aria-hidden="true">{choice.label}</strong>
                    </button>
                  ))}
                </div>
                {!result && (
                  <button
                    className="secondary microphone-fallback"
                    disabled={isListening}
                    onClick={listenForAnswer}
                  >
                    {isListening ? "LISTENING…" : "🎙️ SAY IT"}
                  </button>
                )}
              </section>
            ) : (
              <section className="choice-answer" aria-label="Answer choices">
                <div className="answer-options">
                  {choices.map((choice) => (
                    <button
                      aria-pressed={selectedAnswer === choice.label}
                      className={
                        selectedAnswer === choice.label
                          ? "selected"
                          : "secondary"
                      }
                      disabled={Boolean(result)}
                      onClick={() => setSelectedAnswer(choice.label)}
                      key={choice.id}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
                {!result && (
                  <button
                    className="secondary microphone-fallback"
                    disabled={isListening}
                    onClick={listenForAnswer}
                  >
                    {isListening ? "LISTENING…" : "🎙️ SAY ANSWER"}
                  </button>
                )}
              </section>
            )}
            {!result &&
              !hasPhonemeChoices &&
              location.pathname !== "/learning/adult-scored" && (
                <button disabled={!canSubmit} onClick={() => void submit()}>
                  Check answer
                </button>
              )}
            {result && (
              <>
                <p className={result.correct ? "feedback correct" : "feedback"}>
                  {result.explanation}
                </p>
                {result.placement && (
                  <PlacementSummary
                    placement={result.placement}
                    title={
                      location.pathname === "/learning/placement"
                        ? "New-student placement complete"
                        : location.pathname === "/learning/grade-review"
                          ? "Review complete"
                          : "Grade diagnostic complete"
                    }
                  />
                )}
                {!result.complete && !result.retry && !result.placement ? (
                  <button
                    className="learning-continue-button"
                    data-auto-advance="true"
                    disabled={isAdvancing}
                    onClick={() => void advance()}
                    aria-label="Continue to the next activity"
                  >
                    <span>Continue</span>
                    <span className="continue-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ) : (
                  <button disabled={isAdvancing} onClick={() => void advance()}>
                    {result.complete && result.placement
                      ? "View skills progress"
                      : result.complete
                        ? "Finish session"
                        : "Try another one"}
                  </button>
                )}
              </>
            )}
            {error && <p className="feedback">{error}</p>}
          </section>
        )}
        {location.pathname === "/learning/progress" && (
          <section className="learning-progress">
            <p className="eyebrow">LEARNING PROGRESS</p>
            <h1>Your skills</h1>
            <p className="learning-card-note">
              Your latest diagnostic is kept separate from earlier practice so
              its results are clear.
            </p>
            {currentGradeProgress.map((gradeProgress) => (
              <GradeProgressCard
                key={`${gradeProgress.subject}-${gradeProgress.grade}`}
                progress={gradeProgress}
              />
            ))}
            {progress.skillProgress.length > 0 && (
              <section aria-labelledby="foundational-skills-heading">
                <h2 id="foundational-skills-heading">
                  Foundational reading path
                </h2>
                <div className="progress-grid">
                  {progress.skillProgress.map((skill) => (
                    <article key={skill.skillId}>
                      <strong>{skill.skillName}</strong>
                      <span>{skill.domain}</span>
                      <b>{skill.state.toLowerCase().split("_").join(" ")}</b>
                    </article>
                  ))}
                </div>
              </section>
            )}
            {progress.latestDiagnosticPlacement && (
              <PlacementSummary
                placement={progress.latestDiagnosticPlacement}
                title={
                  progress.latestDiagnosticPlacement.assessmentKind ===
                  "placement"
                    ? "Latest new-student placement"
                    : progress.latestDiagnosticPlacement.assessmentKind ===
                        "diagnostic"
                      ? "Latest grade diagnostic"
                      : "Latest diagnostic"
                }
              />
            )}
            {progress.latestGradeReview && (
              <PlacementSummary
                placement={progress.latestGradeReview}
                title="Latest grade review"
              />
            )}
            {latestDiagnosticProgress.length > 0 && (
              <section aria-labelledby="diagnostic-skills-heading">
                <h2 id="diagnostic-skills-heading">Latest diagnostic skills</h2>
                <SkillProgressCards
                  groups={latestDiagnosticProgress}
                  mastery={progress.mastery}
                  isDiagnostic
                />
              </section>
            )}
            {practiceProgress.length > 0 && (
              <section aria-labelledby="practice-progress-heading">
                <h2 id="practice-progress-heading">
                  Ongoing practice progress
                </h2>
                <SkillProgressCards
                  groups={practiceProgress}
                  mastery={progress.mastery}
                />
              </section>
            )}
            {!progress.attempts.length && (
              <p>
                Start a practice or diagnostic session to see learning activity
                here.
              </p>
            )}
            {latestDiagnosticProgress.length > 0 && (
              <p className="learning-card-note mt-5">
                A diagnostic records what was checked and recommends where to
                begin. Skills move into Learning and Mastered states through
                practice or a verified check.
              </p>
            )}
            {adultObservationNotes.length > 0 && (
              <section className="adult-observation-notes">
                <h2>Adult observation notes</h2>
                <ul>
                  {adultObservationNotes.map((observation, index) => (
                    <li key={`${observation.standardId}-${index}`}>
                      <strong>{observation.standardId}</strong>
                      <span>{observation.note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
