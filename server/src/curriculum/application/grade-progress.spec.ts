import type { DiagnosticPlacement, MasteryRecord } from "../domain/progress";
import { buildGradeProgress, type GradeProgressInput } from "./grade-progress";

const day = (n: number) => new Date(Date.UTC(2026, 10, n));
const standards = ["2.OA.A.1", "2.OA.B.2", "2.NBT.A.1", "2.MD.A.1"].map((standardId) => ({ standardId, statement: `Statement for ${standardId}` }));
const mastery = (standardId: string, state: MasteryRecord["state"], updatedAt: Date): MasteryRecord => ({ learnerId: "molly", standardId, state, scoredAttemptCount: 3, masteryAchievedAt: null, reviewStage: null, nextReviewAt: null, updatedAt });
const assessment = (completedAt: Date, evidence: Array<[string, string]>, extra: Record<string, unknown> = {}): DiagnosticPlacement => ({
  learnerId: "molly", grouping: "Math", grade: "2", learningTargetIds: [], completedAt,
  report: { subject: "MATH", assessmentKind: "diagnostic", gradeResults: [{ grade: "2", domains: [{ evidence: evidence.map(([standardId, status]) => ({ standardId, status })) }] }], ...extra }
});
const input = (overrides: Partial<GradeProgressInput> = {}): GradeProgressInput => ({ subject: "MATH", grade: "2", standards, mastery: [], lessonSkills: [], assessments: [], defaultPassMark: 0.75, ...overrides });

describe("grade progress", () => {
  it("starts with every standard not checked and the full distance to the next grade", () => {
    const progress = buildGradeProgress(input());
    expect(progress).toMatchObject({ totalStandards: 4, secure: 0, notChecked: 4, passMark: 0.75, standardsToNextGrade: 3, isReadyForNextGrade: false, lastAssessedAt: null });
    expect(progress.domains.map((domain) => [domain.domain, domain.total])).toEqual([["OA", 2], ["NBT", 1], ["MD", 1]]);
  });

  it("lets the newest evidence decide, whether it came from practice or an assessment", () => {
    const progress = buildGradeProgress(input({
      mastery: [mastery("2.OA.A.1", "mastered", day(5)), mastery("2.OA.B.2", "mastered", day(1)), mastery("2.NBT.A.1", "practicing", day(1))],
      assessments: [assessment(day(3), [["2.OA.A.1", "DEVELOPING"], ["2.OA.B.2", "EMERGING"], ["2.NBT.A.1", "MASTERED"], ["2.MD.A.1", "INSUFFICIENT_EVIDENCE"]])]
    }));
    const standing = Object.fromEntries(progress.standards.map((standard) => [standard.standardId, [standard.standing, standard.evidenceSource]]));
    expect(standing).toEqual({
      "2.OA.A.1": ["secure", "practice"],
      "2.OA.B.2": ["needsWork", "assessment"],
      "2.NBT.A.1": ["secure", "assessment"],
      "2.MD.A.1": ["needsWork", "assessment"]
    });
    expect(progress).toMatchObject({ secure: 2, needsWork: 2, standardsToNextGrade: 1, lastAssessedAt: day(3) });
  });

  it("counts a lesson-taught standard as secure only when every lesson skill for it is mastered", () => {
    const partly = buildGradeProgress(input({ lessonSkills: [{ standardIds: ["2.MD.A.1"], state: "MASTERED", updatedAt: day(2) }, { standardIds: ["2.MD.A.1"], state: "PRACTICING", updatedAt: day(2) }] }));
    const fully = buildGradeProgress(input({ lessonSkills: [{ standardIds: ["2.MD.A.1"], state: "MASTERED", updatedAt: day(2) }, { standardIds: ["2.MD.A.1"], state: "REVIEW_DUE", updatedAt: day(3) }] }));
    expect(partly.standards.find((standard) => standard.standardId === "2.MD.A.1")?.standing).toBe("inProgress");
    expect(fully.standards.find((standard) => standard.standardId === "2.MD.A.1")?.standing).toBe("secure");
  });

  it("uses the pass mark from the latest diagnostic of the grade to say how close the next grade is", () => {
    const allSecure: Array<[string, string]> = standards.map((standard) => [standard.standardId, "MASTERED"]);
    const threeSecure: Array<[string, string]> = [...allSecure.slice(0, 3), ["2.MD.A.1", "DEVELOPING"]];
    expect(buildGradeProgress(input({ assessments: [assessment(day(2), threeSecure, { passMark: 0.75 })] }))).toMatchObject({ passMark: 0.75, standardsToNextGrade: 0, isReadyForNextGrade: true });
    expect(buildGradeProgress(input({ assessments: [assessment(day(2), threeSecure, { passMark: 1 })] }))).toMatchObject({ passMark: 1, standardsToNextGrade: 1, isReadyForNextGrade: false });
  });

  it("ignores other subjects and other grades", () => {
    const elsewhere: DiagnosticPlacement = { ...assessment(day(2), [["2.OA.A.1", "MASTERED"]]), report: { subject: "ELA", gradeResults: [{ grade: "2", domains: [{ evidence: [{ standardId: "2.OA.A.1", status: "MASTERED" }] }] }] } };
    const otherGrade: DiagnosticPlacement = { ...assessment(day(2), []), report: { subject: "MATH", gradeResults: [{ grade: "1", domains: [{ evidence: [{ standardId: "2.OA.A.1", status: "MASTERED" }] }] }] } };
    expect(buildGradeProgress(input({ assessments: [elsewhere, otherGrade] })).secure).toBe(0);
  });
});
