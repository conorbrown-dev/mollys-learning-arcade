import type { DiagnosticPlacement, MasteryRecord } from "../domain/progress";
import type { SkillProgressState } from "../domain/ela-skill";

/**
 * Where a student stands on one standard, judged from the newest evidence the app has:
 * - secure: practice mastery, a mastered lesson skill, or a diagnostic/review that showed it.
 * - needsWork: the latest diagnostic or review showed gaps or could not confirm it.
 * - inProgress: the student is learning or practicing it, but has not shown it yet.
 * - notChecked: nothing has been asked about it yet.
 */
export type StandardStanding = "secure" | "needsWork" | "inProgress" | "notChecked";

export interface GradeStandard { standardId: string; statement: string | null; }
export interface LessonSkillEvidence { standardIds: string[]; state: SkillProgressState; updatedAt: Date; }

export interface GradeProgressInput {
  subject: "ELA" | "MATH";
  grade: string;
  standards: GradeStandard[];
  mastery: MasteryRecord[];
  lessonSkills: LessonSkillEvidence[];
  assessments: DiagnosticPlacement[];
  defaultPassMark: number;
}

export interface StandardProgress extends GradeStandard { domain: string; standing: StandardStanding; evidenceSource: "practice" | "lesson" | "assessment" | null; evidenceAt: Date | null; }
export interface DomainProgress { domain: string; label: string; total: number; secure: number; needsWork: number; }

export interface GradeProgress {
  subject: "ELA" | "MATH";
  grade: string;
  totalStandards: number;
  secure: number;
  needsWork: number;
  inProgress: number;
  notChecked: number;
  /** Share of the grade's standards that are secure, from 0 to 1. */
  shareSecure: number;
  /** The pass mark used for the latest diagnostic of this grade, or the default when none has been taken. */
  passMark: number;
  /** How many more standards must become secure to reach the pass mark. Zero means the grade is passed. */
  standardsToNextGrade: number;
  isReadyForNextGrade: boolean;
  lastAssessedAt: Date | null;
  domains: DomainProgress[];
  standards: StandardProgress[];
}

const domainLabels: Record<string, string> = {
  L: "Language and vocabulary", RF: "Foundational reading", RI: "Informational reading", RL: "Literature",
  CC: "Counting and cardinality", OA: "Operations and algebraic thinking", NBT: "Base-ten number sense", MD: "Measurement and data", G: "Geometry"
};
const domainOf = (standardId: string) => standardId.split(".")[1] ?? standardId;

type Evidence = { standing: Exclude<StandardStanding, "notChecked">; source: "practice" | "lesson" | "assessment"; at: Date };

function practiceEvidence(record: MasteryRecord): Evidence | null {
  if (record.state === "mastered" || record.state === "reviewDue") return { standing: "secure", source: "practice", at: record.updatedAt };
  if (record.state === "learning" || record.state === "practicing") return { standing: "inProgress", source: "practice", at: record.updatedAt };
  return null;
}

/** A standard taught through lessons counts as secure only when every lesson skill for it is mastered. */
function lessonEvidence(standardId: string, skills: LessonSkillEvidence[]): Evidence | null {
  const related = skills.filter((skill) => skill.standardIds.includes(standardId));
  const started = related.filter((skill) => skill.state !== "NOT_INTRODUCED");
  if (started.length === 0) return null;
  const at = new Date(Math.max(...started.map((skill) => skill.updatedAt.getTime())));
  const isSecure = related.every((skill) => skill.state === "MASTERED" || skill.state === "REVIEW_DUE");
  return { standing: isSecure ? "secure" : "inProgress", source: "lesson", at };
}

type ReportEvidence = { standardId: string; status: string };
type ReportGrade = { grade: string; domains: Array<{ evidence: ReportEvidence[] }> };

function assessmentEvidence(standardId: string, grade: string, subject: GradeProgressInput["subject"], assessments: DiagnosticPlacement[]): Evidence | null {
  let newest: Evidence | null = null;
  for (const assessment of assessments) {
    if (assessment.report.subject !== subject) continue;
    const grades = (assessment.report.gradeResults as ReportGrade[] | undefined) ?? [];
    const item = grades.filter((result) => result.grade === grade).flatMap((result) => result.domains.flatMap((domain) => domain.evidence)).find((evidence) => evidence.standardId === standardId);
    if (!item || item.status === "UNASSESSED") continue;
    const standing = item.status === "MASTERED" || item.status === "STRONG_MASTERY" ? "secure" : "needsWork";
    if (!newest || assessment.completedAt > newest.at) newest = { standing, source: "assessment", at: assessment.completedAt };
  }
  return newest;
}

const newestOf = (items: Array<Evidence | null>) => items.filter((item): item is Evidence => item !== null).sort((left, right) => right.at.getTime() - left.at.getTime())[0] ?? null;

export function buildGradeProgress(input: GradeProgressInput): GradeProgress {
  const masteryByStandard = new Map(input.mastery.map((record) => [record.standardId, record]));
  const standards: StandardProgress[] = input.standards.map((standard) => {
    const practice = masteryByStandard.get(standard.standardId);
    const evidence = newestOf([
      practice ? practiceEvidence(practice) : null,
      lessonEvidence(standard.standardId, input.lessonSkills),
      assessmentEvidence(standard.standardId, input.grade, input.subject, input.assessments)
    ]);
    return { ...standard, domain: domainOf(standard.standardId), standing: evidence?.standing ?? "notChecked", evidenceSource: evidence?.source ?? null, evidenceAt: evidence?.at ?? null };
  });
  const count = (standing: StandardStanding, items = standards) => items.filter((item) => item.standing === standing).length;
  const gradeAssessments = input.assessments
    .filter((assessment) => assessment.report.subject === input.subject && ((assessment.report.gradeResults as ReportGrade[] | undefined) ?? []).some((result) => result.grade === input.grade))
    .sort((left, right) => right.completedAt.getTime() - left.completedAt.getTime());
  const latestDiagnostic = gradeAssessments.find((assessment) => assessment.report.assessmentKind === "diagnostic");
  const passMark = typeof latestDiagnostic?.report.passMark === "number" ? latestDiagnostic.report.passMark : input.defaultPassMark;
  const secure = count("secure");
  const needed = Math.ceil(passMark * standards.length);
  const standardsToNextGrade = Math.max(0, needed - secure);
  const domains = [...new Set(standards.map((standard) => standard.domain))].map((domain) => {
    const items = standards.filter((standard) => standard.domain === domain);
    return { domain, label: domainLabels[domain] ?? domain, total: items.length, secure: count("secure", items), needsWork: count("needsWork", items) };
  });
  return {
    subject: input.subject,
    grade: input.grade,
    totalStandards: standards.length,
    secure,
    needsWork: count("needsWork"),
    inProgress: count("inProgress"),
    notChecked: count("notChecked"),
    shareSecure: standards.length === 0 ? 0 : secure / standards.length,
    passMark,
    standardsToNextGrade,
    isReadyForNextGrade: standards.length > 0 && standardsToNextGrade === 0,
    lastAssessedAt: gradeAssessments[0]?.completedAt ?? null,
    domains,
    standards
  };
}
