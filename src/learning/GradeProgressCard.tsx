import type { CSSProperties } from "react";
import type { GradeProgress, StandardStanding } from "./learningApplication";

const SUBJECT_NAMES: Record<GradeProgress["subject"], string> = {
  ELA: "Reading & Language",
  MATH: "Math",
};
const GRADE_NAMES: Record<GradeProgress["grade"], string> = {
  K: "Kindergarten",
  "1": "Grade 1",
  "2": "Grade 2",
};
const NEXT_GRADE: Record<GradeProgress["grade"], string | null> = {
  K: "Grade 1",
  "1": "Grade 2",
  "2": null,
};
const STANDING_LABELS: Record<StandardStanding, string> = {
  secure: "Secure",
  needsWork: "Needs work",
  inProgress: "Practicing",
  notChecked: "Not checked yet",
};

const percent = (share: number) => `${Math.round(share * 100)}%`;
const skills = (count: number) => `${count} skill${count === 1 ? "" : "s"}`;

function readinessMessage(progress: GradeProgress): string {
  const nextGrade = NEXT_GRADE[progress.grade];
  const passMark = percent(progress.passMark);
  if (progress.isReadyForNextGrade) {
    return nextGrade
      ? `Ready for ${nextGrade}: at least ${passMark} of skills are secure.`
      : `${GRADE_NAMES[progress.grade]} is passed. It is the highest grade in the app so far.`;
  }
  const target = nextGrade ?? `passing ${GRADE_NAMES[progress.grade]}`;
  const remaining = progress.standardsToNextGrade;
  return `${remaining} more ${remaining === 1 ? "skill" : "skills"} to reach the ${passMark} pass mark for ${target}.`;
}

function nextStepMessage(progress: GradeProgress): string | null {
  if (progress.notChecked > 0) {
    return progress.notChecked === 1
      ? "1 skill has not been checked yet. A grade diagnostic will check it."
      : `${skills(progress.notChecked)} have not been checked yet. A grade diagnostic will check them.`;
  }
  if (progress.needsWork > 0) {
    return "Practice starts with the skills that need work.";
  }
  return null;
}

/** How a student is doing in their current grade: what is secure, what needs work, and how close the next grade is. */
export function GradeProgressCard({ progress }: { progress: GradeProgress }): JSX.Element {
  const headingId = `grade-progress-${progress.subject}-${progress.grade}`;
  const needsWork = progress.standards.filter((standard) => standard.standing === "needsWork");
  const nextStep = nextStepMessage(progress);
  const meterStyle = {
    "--secure-share": percent(progress.shareSecure),
    "--pass-mark": percent(progress.passMark),
  } as CSSProperties;

  return (
    <section className="grade-progress" aria-labelledby={headingId}>
      <h2 id={headingId}>
        {GRADE_NAMES[progress.grade]} {SUBJECT_NAMES[progress.subject]}
      </h2>
      <p className="grade-progress-total">
        <strong>
          {progress.secure} of {progress.totalStandards} skills secure
        </strong>{" "}
        ({percent(progress.shareSecure)})
      </p>
      <div
        className="grade-progress-meter"
        style={meterStyle}
        role="img"
        aria-label={`${percent(progress.shareSecure)} of skills secure. The pass mark is ${percent(progress.passMark)}.`}
      >
        <span className="grade-progress-fill" />
        <span className="grade-progress-mark" />
      </div>
      <p
        className={
          progress.isReadyForNextGrade
            ? "grade-progress-readiness is-ready"
            : "grade-progress-readiness"
        }
      >
        {readinessMessage(progress)}
      </p>
      <ul className="grade-progress-counts">
        <li>
          <b>{progress.needsWork}</b>{" "}
          {progress.needsWork === 1 ? "needs work" : "need work"}
        </li>
        <li>
          <b>{progress.inProgress}</b> being practiced
        </li>
        <li>
          <b>{progress.notChecked}</b> not checked yet
        </li>
      </ul>
      {nextStep && <p className="learning-card-note">{nextStep}</p>}
      <table className="grade-progress-domains">
        <caption>By area</caption>
        <thead>
          <tr>
            <th scope="col">Area</th>
            <th scope="col">Secure</th>
            <th scope="col">Needs work</th>
          </tr>
        </thead>
        <tbody>
          {progress.domains.map((domain) => (
            <tr key={domain.domain}>
              <th scope="row">{domain.label}</th>
              <td>
                {domain.secure} of {domain.total}
              </td>
              <td>{domain.needsWork}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {needsWork.length > 0 && (
        <details className="grade-progress-gaps">
          <summary>Skills that need work ({needsWork.length})</summary>
          <ul>
            {needsWork.map((standard) => (
              <li key={standard.standardId}>
                <span className="grade-progress-standard">
                  {standard.standardId}
                </span>{" "}
                {standard.statement ?? STANDING_LABELS[standard.standing]}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
