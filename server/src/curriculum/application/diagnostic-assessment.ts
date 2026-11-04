import type { QuestionTemplate } from "../domain/question-template";

export const DIAGNOSTIC_EVIDENCE_STATUSES = ["UNASSESSED", "INSUFFICIENT_EVIDENCE", "EMERGING", "DEVELOPING", "MASTERED", "STRONG_MASTERY"] as const;
export type DiagnosticEvidenceStatus = (typeof DIAGNOSTIC_EVIDENCE_STATUSES)[number];
export type PlacementConfidence = "LOW" | "MODERATE" | "HIGH";

/**
 * "sampled" checks a few standards per domain (used by placement, which has to
 * search across grades quickly). "complete" checks every standard in the grade.
 */
export type DiagnosticCoverage = "sampled" | "complete";

export interface DiagnosticPolicy {
  minimumEvidence: number;
  maximumEvidence: number;
  masteryThreshold: number;
  requiredStandardsPerDomain: number;
  domainMasteryThreshold: number;
  gradeMasteryThreshold: number;
  maximumItemsPerGrade: number;
  /** Defaults to "sampled". With "complete", requiredStandardsPerDomain and maximumItemsPerGrade are ignored. */
  coverage?: DiagnosticCoverage;
}

export const defaultDiagnosticPolicy: DiagnosticPolicy = {
  minimumEvidence: 2,
  maximumEvidence: 4,
  masteryThreshold: 0.75,
  requiredStandardsPerDomain: 2,
  domainMasteryThreshold: 0.5,
  gradeMasteryThreshold: 0.75,
  maximumItemsPerGrade: 30
};

/**
 * Policy for the current-grade diagnostic and the parent-triggered grade review.
 * Every standard in the grade is checked, so a domain counts as secure only when
 * most of its standards are, instead of half of two sampled ones. Per-standard
 * evidence stays at 2–4 because most standards have only two or three distinct
 * generated questions.
 */
export const gradeDiagnosticPolicy: DiagnosticPolicy = {
  minimumEvidence: 2,
  maximumEvidence: 4,
  masteryThreshold: 0.75,
  requiredStandardsPerDomain: Number.POSITIVE_INFINITY,
  domainMasteryThreshold: 0.75,
  gradeMasteryThreshold: 0.75,
  maximumItemsPerGrade: Number.POSITIVE_INFINITY,
  coverage: "complete"
};

export interface DiagnosticSkillRequirement {
  standardId: string;
  domain: string;
  templateIds: string[];
  minimumEvidence: number;
  maximumEvidence: number;
  masteryThreshold: number;
  isCritical: boolean;
}

export interface DiagnosticDomainRequirement {
  domain: string;
  label: string;
  isCritical: boolean;
  weight: number;
  masteryThreshold: number;
  skills: DiagnosticSkillRequirement[];
}

export interface DiagnosticGradeBlueprint {
  grade: string;
  domains: DiagnosticDomainRequirement[];
  maximumItems: number;
  masteryThreshold: number;
}

export interface DiagnosticBlueprint {
  subject: "ELA" | "MATH";
  grouping: string;
  grades: DiagnosticGradeBlueprint[];
  /** Absent on sessions saved before complete-coverage diagnostics existed; treated as "sampled". */
  coverage?: DiagnosticCoverage;
}

export interface DiagnosticProbe {
  standardId: string;
  grade: string;
  domain: string;
  templateId: string;
  questionInstanceId: string;
  difficultyBand: number;
  correct: boolean;
  independent: boolean;
}

export interface DiagnosticSkillEvidence {
  standardId: string;
  grade: string;
  domain: string;
  attemptCount: number;
  correctCount: number;
  incorrectCount: number;
  recentPerformance: boolean[];
  difficultyLevelsObserved: number[];
  questionInstanceIds: string[];
  templateIds: string[];
  confidence: number;
  status: DiagnosticEvidenceStatus;
  isCritical: boolean;
}

export interface DiagnosticDomainResult {
  domain: string;
  label: string;
  grade: string;
  isCritical: boolean;
  isCovered: boolean;
  isMastered: boolean;
  coverage: number;
  masteredStandards: number;
  requiredStandards: number;
  evidence: DiagnosticSkillEvidence[];
}

export interface DiagnosticGradeResult {
  grade: string;
  isCovered: boolean;
  isMastered: boolean;
  coverage: number;
  confidence: PlacementConfidence;
  domains: DiagnosticDomainResult[];
  unresolvedSkillIds: string[];
  criticalGapIds: string[];
}

export interface DiagnosticState {
  blueprint: DiagnosticBlueprint;
  gradeIndex: number;
  probes: DiagnosticProbe[];
  gradeResults: DiagnosticGradeResult[];
  unavailableSkillIds?: string[];
  isComplete: boolean;
}

export interface DiagnosticReport {
  subject: "ELA" | "MATH";
  grouping: string;
  instructionalGrade: string;
  placementConfidence: PlacementConfidence;
  evidenceCoverage: number;
  totalItems: number;
  /** Set by the facade when the report is stored, so a grade review is never mistaken for the student's real diagnostic. Absent on older reports. */
  assessmentKind?: "placement" | "diagnostic" | "gradeReview";
  /** Number of distinct standards that were checked. */
  standardsAssessed: number;
  /** True when the final grade that was checked met every mastery rule. */
  isGradeMastered: boolean;
  demonstratedStrengths: string[];
  needsReinforcement: string[];
  criticalPrerequisiteGaps: string[];
  unresolvedSkills: string[];
  strandPlacements: Array<{ domain: string; label: string; instructionalGrade: string; status: "ready" | "needsReinforcement" | "unresolved" }>;
  gradeResults: DiagnosticGradeResult[];
}

const gradeOrder = ["K", "1", "2"];
const criticalDomains: Record<DiagnosticBlueprint["subject"], Record<string, string[]>> = {
  ELA: { K: ["RF"], "1": ["RF"], "2": ["RF"] },
  MATH: { K: ["CC"], "1": ["OA", "NBT"], "2": ["OA", "NBT"] }
};
const domainLabels: Record<string, string> = {
  L: "Language and vocabulary", RF: "Foundational reading", RI: "Informational reading", RL: "Literature",
  CC: "Counting and cardinality", OA: "Operations and algebraic thinking", NBT: "Base-ten number sense", MD: "Measurement and data", G: "Geometry"
};

const rotate = <T>(items: T[], offset: number): T[] => items.length < 2 ? items : [...items.slice(offset % items.length), ...items.slice(0, offset % items.length)];
const domainOf = (standardId: string): string => standardId.split(".")[1] ?? standardId;
const isMastery = (status: DiagnosticEvidenceStatus): boolean => status === "MASTERED" || status === "STRONG_MASTERY";

function buildGradeBlueprint(
  templates: QuestionTemplate[],
  subject: DiagnosticBlueprint["subject"],
  grade: string,
  gradeIndex: number,
  seed: number,
  policy: DiagnosticPolicy
): DiagnosticGradeBlueprint {
  const isComplete = policy.coverage === "complete";
  const byDomain = new Map<string, QuestionTemplate[]>();
  for (const template of templates.filter((item) => item.grade === grade)) {
    const domain = domainOf(template.primaryStandardId);
    byDomain.set(domain, [...(byDomain.get(domain) ?? []), template]);
  }
  const domains = [...byDomain.keys()].sort().map((domain, domainIndex): DiagnosticDomainRequirement => {
    const domainTemplates = byDomain.get(domain) ?? [];
    const byStandard = new Map<string, QuestionTemplate[]>();
    for (const template of domainTemplates) byStandard.set(template.primaryStandardId, [...(byStandard.get(template.primaryStandardId) ?? []), template]);
    const sortedIds = [...byStandard.keys()].sort();
    const selectedIds = isComplete
      ? sortedIds
      : rotate(sortedIds, Math.abs(seed + gradeIndex * 17 + domainIndex * 31)).slice(0, Math.min(policy.requiredStandardsPerDomain, sortedIds.length));
    const isCritical = criticalDomains[subject][grade]?.includes(domain) ?? false;
    return {
      domain,
      label: domainLabels[domain] ?? domain,
      isCritical,
      weight: 1,
      masteryThreshold: isCritical ? 1 : policy.domainMasteryThreshold,
      skills: selectedIds.map((standardId) => ({
        standardId,
        domain,
        templateIds: (byStandard.get(standardId) ?? []).map((template) => template.id).sort(),
        minimumEvidence: policy.minimumEvidence,
        maximumEvidence: policy.maximumEvidence,
        masteryThreshold: policy.masteryThreshold,
        isCritical
      }))
    };
  });
  // Complete coverage has no fixed cap: the ceiling is every standard asked its maximum number of times.
  const maximumItems = isComplete
    ? domains.reduce((sum, domain) => sum + domain.skills.reduce((skillSum, skill) => skillSum + skill.maximumEvidence, 0), 0)
    : policy.maximumItemsPerGrade;
  return { grade, domains, maximumItems, masteryThreshold: policy.gradeMasteryThreshold };
}

/** Placement: samples a few standards per domain and climbs Kindergarten → Grade 2 until a grade is not secure. */
export function createDiagnosticBlueprint(
  templates: QuestionTemplate[],
  subject: DiagnosticBlueprint["subject"],
  grouping: string,
  seed: number,
  policy: DiagnosticPolicy = defaultDiagnosticPolicy
): DiagnosticBlueprint {
  const grades = gradeOrder.map((grade, gradeIndex) => buildGradeBlueprint(templates, subject, grade, gradeIndex, seed, policy));
  if (grades.some((grade) => grade.domains.length === 0)) throw new Error(`A complete K–2 ${grouping} diagnostic is not available yet.`);
  return { subject, grouping, grades, coverage: policy.coverage ?? "sampled" };
}

/**
 * Current-grade diagnostic and grade review: checks every standard in one grade
 * and never moves to another grade. Lower-grade material is only ever assessed
 * when an adult asks for a review of that grade.
 */
export function createGradeDiagnosticBlueprint(
  templates: QuestionTemplate[],
  subject: DiagnosticBlueprint["subject"],
  grouping: string,
  grade: string,
  policy: DiagnosticPolicy = gradeDiagnosticPolicy
): DiagnosticBlueprint {
  if (!gradeOrder.includes(grade)) throw new Error(`Grade ${grade} is not part of the K–2 diagnostic.`);
  const gradeBlueprint = buildGradeBlueprint(templates, subject, grade, gradeOrder.indexOf(grade), 0, policy);
  if (gradeBlueprint.domains.length === 0) throw new Error(`A complete ${grade === "K" ? "Kindergarten" : `Grade ${grade}`} ${grouping} diagnostic is not available yet.`);
  return { subject, grouping, grades: [gradeBlueprint], coverage: policy.coverage ?? "complete" };
}

export function startDiagnostic(blueprint: DiagnosticBlueprint): DiagnosticState {
  return { blueprint, gradeIndex: 0, probes: [], gradeResults: [], isComplete: false };
}

export function evidenceForSkill(state: DiagnosticState, skill: DiagnosticSkillRequirement, grade: string): DiagnosticSkillEvidence {
  const probes = state.probes.filter((probe) => probe.independent && probe.grade === grade && probe.standardId === skill.standardId);
  const unique = [...new Map(probes.map((probe) => [probe.questionInstanceId, probe])).values()];
  const correctCount = unique.filter((probe) => probe.correct).length;
  const attemptCount = unique.length;
  const accuracy = attemptCount === 0 ? 0 : correctCount / attemptCount;
  let status: DiagnosticEvidenceStatus = "UNASSESSED";
  if (attemptCount > 0 && attemptCount < skill.minimumEvidence) status = "INSUFFICIENT_EVIDENCE";
  else if (attemptCount >= skill.minimumEvidence && correctCount === 0) status = "EMERGING";
  else if (attemptCount >= skill.minimumEvidence && accuracy >= skill.masteryThreshold) status = attemptCount >= 3 && accuracy === 1 ? "STRONG_MASTERY" : "MASTERED";
  else if (attemptCount >= skill.maximumEvidence) status = "DEVELOPING";
  else if (attemptCount >= skill.minimumEvidence) status = "INSUFFICIENT_EVIDENCE";
  return {
    standardId: skill.standardId,
    grade,
    domain: skill.domain,
    attemptCount,
    correctCount,
    incorrectCount: attemptCount - correctCount,
    recentPerformance: unique.slice(-skill.maximumEvidence).map((probe) => probe.correct),
    difficultyLevelsObserved: [...new Set(unique.map((probe) => probe.difficultyBand))],
    questionInstanceIds: unique.map((probe) => probe.questionInstanceId),
    templateIds: [...new Set(unique.map((probe) => probe.templateId))],
    confidence: Math.min(1, attemptCount / skill.maximumEvidence),
    status,
    isCritical: skill.isCritical
  };
}

function orderedSkills(grade: DiagnosticGradeBlueprint): DiagnosticSkillRequirement[] {
  const selected: DiagnosticSkillRequirement[] = [];
  const maximumSkills = Math.max(...grade.domains.map((domain) => domain.skills.length));
  for (let index = 0; index < maximumSkills; index += 1) {
    for (const domain of grade.domains) if (domain.skills[index]) selected.push(domain.skills[index]);
  }
  return selected;
}

export function selectNextDiagnosticSkill(state: DiagnosticState): DiagnosticSkillRequirement | null {
  if (state.isComplete) return null;
  const grade = state.blueprint.grades[state.gradeIndex];
  const gradeItemCount = state.probes.filter((probe) => probe.grade === grade.grade).length;
  if (gradeItemCount >= grade.maximumItems) return null;
  const unavailable = new Set(state.unavailableSkillIds ?? []);
  const skills = orderedSkills(grade).filter((skill) => !unavailable.has(skill.standardId));
  if (skills.length === 0) return null;
  for (let targetCount = 0; targetCount < Math.max(...skills.map((skill) => skill.minimumEvidence)); targetCount += 1) {
    const skill = skills.find((candidate) => evidenceForSkill(state, candidate, grade.grade).attemptCount === targetCount);
    if (skill) return skill;
  }
  return skills.find((skill) => evidenceForSkill(state, skill, grade.grade).status === "INSUFFICIENT_EVIDENCE" && evidenceForSkill(state, skill, grade.grade).attemptCount < skill.maximumEvidence) ?? null;
}

/**
 * The total shown to the student ("12 / 90 completed").
 *
 * A complete-coverage diagnostic can ask up to four times as many questions as it
 * needs in the common case, so the ceiling would badly overstate the length.
 * Instead this is what has been answered plus the least that must still be asked;
 * it only grows when an unclear answer pattern earns a skill extra questions.
 */
export function diagnosticSessionLength(state: DiagnosticState): number {
  const grade = state.blueprint.grades[state.gradeIndex];
  if (state.blueprint.coverage !== "complete") return grade.maximumItems;
  const unavailable = new Set(state.unavailableSkillIds ?? []);
  const answered = state.probes.filter((probe) => probe.grade === grade.grade).length;
  const stillRequired = grade.domains
    .flatMap((domain) => domain.skills)
    .filter((skill) => !unavailable.has(skill.standardId))
    .reduce((sum, skill) => sum + Math.max(0, skill.minimumEvidence - evidenceForSkill(state, skill, grade.grade).attemptCount), 0);
  return answered + stillRequired;
}

export function markDiagnosticSkillUnavailable(state: DiagnosticState, standardId: string): DiagnosticState {
  return { ...state, unavailableSkillIds: [...new Set([...(state.unavailableSkillIds ?? []), standardId])] };
}

export function recordDiagnosticProbe(state: DiagnosticState, probe: DiagnosticProbe): DiagnosticState {
  if (state.probes.some((existing) => existing.questionInstanceId === probe.questionInstanceId)) return state;
  return { ...state, probes: [...state.probes, probe] };
}

export function evaluateCurrentGrade(state: DiagnosticState): DiagnosticGradeResult {
  const grade = state.blueprint.grades[state.gradeIndex];
  const domains = grade.domains.map((domain): DiagnosticDomainResult => {
    const evidence = domain.skills.map((skill) => evidenceForSkill(state, skill, grade.grade));
    const requiredEvidence = domain.skills.reduce((sum, skill) => sum + skill.minimumEvidence, 0);
    const observedEvidence = domain.skills.reduce((sum, skill, index) => sum + Math.min(evidence[index].attemptCount, skill.minimumEvidence), 0);
    const masteredStandards = evidence.filter((item) => isMastery(item.status)).length;
    return {
      domain: domain.domain,
      label: domain.label,
      grade: grade.grade,
      isCritical: domain.isCritical,
      isCovered: observedEvidence === requiredEvidence,
      isMastered: observedEvidence === requiredEvidence && masteredStandards / domain.skills.length >= domain.masteryThreshold,
      coverage: requiredEvidence === 0 ? 0 : observedEvidence / requiredEvidence,
      masteredStandards,
      requiredStandards: domain.skills.length,
      evidence
    };
  });
  const totalWeight = domains.reduce((sum, _domain, index) => sum + grade.domains[index].weight, 0);
  const masteredWeight = domains.reduce((sum, domain, index) => sum + (domain.isMastered ? grade.domains[index].weight : 0), 0);
  const isCovered = domains.every((domain) => domain.isCovered);
  const unresolvedSkillIds = domains.flatMap((domain) => domain.evidence.filter((item) => item.status === "UNASSESSED" || item.status === "INSUFFICIENT_EVIDENCE").map((item) => item.standardId));
  const criticalGapIds = domains.filter((domain) => domain.isCritical && !domain.isMastered).flatMap((domain) => domain.evidence.filter((item) => !isMastery(item.status)).map((item) => item.standardId));
  const coverage = domains.reduce((sum, domain) => sum + domain.coverage, 0) / domains.length;
  const hasCriticalGap = domains.some((domain) => domain.isCritical && !domain.isMastered);
  const isMastered = isCovered && unresolvedSkillIds.length === 0 && !hasCriticalGap && masteredWeight / totalWeight >= grade.masteryThreshold;
  const confidence: PlacementConfidence = !isCovered ? "LOW" : unresolvedSkillIds.length > 0 ? "MODERATE" : "HIGH";
  return { grade: grade.grade, isCovered, isMastered, coverage, confidence, domains, unresolvedSkillIds, criticalGapIds };
}

export function advanceDiagnostic(state: DiagnosticState): DiagnosticState {
  if (selectNextDiagnosticSkill(state)) return state;
  const result = evaluateCurrentGrade(state);
  const gradeResults = [...state.gradeResults.filter((item) => item.grade !== result.grade), result];
  const hasNextGrade = result.isMastered && state.gradeIndex + 1 < state.blueprint.grades.length;
  return hasNextGrade ? { ...state, gradeIndex: state.gradeIndex + 1, gradeResults } : { ...state, gradeResults, isComplete: true };
}

export function buildDiagnosticReport(state: DiagnosticState): DiagnosticReport {
  if (!state.isComplete) throw new Error("A diagnostic report requires a completed assessment.");
  const evidence = state.gradeResults.flatMap((grade) => grade.domains.flatMap((domain) => domain.evidence));
  const terminal = state.gradeResults.at(-1)!;
  const instructionalGrade = terminal.grade;
  const domainNames = [...new Set(state.gradeResults.flatMap((grade) => grade.domains.map((domain) => domain.domain)))];
  const strandPlacements = domainNames.map((domain) => {
    const results = state.gradeResults.flatMap((grade) => grade.domains.filter((item) => item.domain === domain));
    const terminalDomain = results.find((result) => !result.isMastered) ?? results.at(-1)!;
    const hasUnresolved = terminalDomain.evidence.some((item) => item.status === "UNASSESSED" || item.status === "INSUFFICIENT_EVIDENCE");
    return {
      domain,
      label: terminalDomain.label,
      instructionalGrade: terminalDomain.grade,
      status: hasUnresolved ? "unresolved" as const : terminalDomain.isMastered ? "ready" as const : "needsReinforcement" as const
    };
  });
  const unique = (values: string[]) => [...new Set(values)];
  const confidence: PlacementConfidence = state.gradeResults.some((grade) => grade.confidence === "LOW") ? "LOW" : state.gradeResults.some((grade) => grade.confidence === "MODERATE") ? "MODERATE" : "HIGH";
  return {
    subject: state.blueprint.subject,
    grouping: state.blueprint.grouping,
    instructionalGrade,
    placementConfidence: confidence,
    evidenceCoverage: state.gradeResults.reduce((sum, grade) => sum + grade.coverage, 0) / state.gradeResults.length,
    totalItems: state.probes.length,
    standardsAssessed: unique(evidence.map((item) => item.standardId)).length,
    isGradeMastered: terminal.isMastered,
    demonstratedStrengths: unique(evidence.filter((item) => isMastery(item.status)).map((item) => item.standardId)),
    needsReinforcement: unique(evidence.filter((item) => item.status === "EMERGING" || item.status === "DEVELOPING").map((item) => item.standardId)),
    criticalPrerequisiteGaps: unique(state.gradeResults.flatMap((grade) => grade.criticalGapIds)),
    unresolvedSkills: unique(state.gradeResults.flatMap((grade) => grade.unresolvedSkillIds)),
    strandPlacements,
    gradeResults: state.gradeResults
  };
}
