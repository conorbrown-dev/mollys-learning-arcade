import { InMemoryProgressRepository } from "../infrastructure/in-memory-progress.repository";
import { gradeOneElaTemplates } from "../data/grade-one-ela-templates";
import { GRADE_ONE_ELA_ACTIVITIES, GRADE_ONE_ELA_SKILLS } from "../infrastructure/grade-one-ela-catalog";
import { validateGradeOneElaCatalog } from "../infrastructure/grade-one-ela.validator";
import { gradeOneElaCatalog, lessonCatalogFor, lessonCatalogSkill } from "../infrastructure/lesson-catalogs";
import { LessonActivityEngine, evaluateLessonActivity, type LessonActivityCheckpoint } from "./lesson-activity-engine";

const NOW = new Date("2026-11-03T12:00:00.000Z");

/** Walks a learner through the catalog, answering every activity correctly. */
async function masterEverything(maxSteps = 4000) {
  const repository = new InMemoryProgressRepository();
  const engine = new LessonActivityEngine(gradeOneElaCatalog, repository, () => NOW);
  const learnerId = "grade-one-learner";
  const purposes = new Set<string>();
  const skills = new Set<string>();
  let recent: string[] = [];
  let steps = 0;
  let completionMessage: string | null = null;

  for (; steps < maxSteps; steps += 1) {
    let selection;
    try {
      selection = await engine.select(learnerId, recent, steps + 1);
    } catch (error) {
      completionMessage = error instanceof Error ? error.message : String(error);
      break;
    }
    purposes.add(selection.activity.purpose);
    skills.add(selection.skill.id);
    const checkpoint: LessonActivityCheckpoint = {
      catalogId: gradeOneElaCatalog.id,
      activityId: selection.activity.id,
      activityVersion: selection.activity.version,
      instanceId: `instance-${steps}`,
      selectionReason: selection.selectionReason,
      supportLevels: [],
      isRecorded: true,
      recentActivityIds: [...recent, selection.activity.id],
    };
    await engine.record(learnerId, "session", checkpoint, true, selection.activity.canonicalAnswer);
    recent = [...recent, selection.activity.id].slice(-gradeOneElaCatalog.activityExclusionWindow);
  }

  return { repository, learnerId, steps, purposes, skills, completionMessage };
}

describe("Grade 1 ELA in-app lessons", () => {
  it("teaches every standard the Grade 1 proficiency test draws on", () => {
    const tested = new Set(gradeOneElaTemplates.map((template) => template.standardId));
    const taught = new Set(
      GRADE_ONE_ELA_SKILLS.flatMap((skill) =>
        skill.standardMappings.filter((mapping) => mapping.relationship === "PRIMARY").map((mapping) => mapping.standardId),
      ),
    );
    expect([...tested].filter((standardId) => !taught.has(standardId))).toEqual([]);
    expect(taught.size).toBe(tested.size);
  });

  it("passes catalog validation", async () => {
    await expect(validateGradeOneElaCatalog()).resolves.toBeUndefined();
  });

  it("needs no physical materials and no recorded phoneme audio", () => {
    for (const activity of GRADE_ONE_ELA_ACTIVITIES) {
      const cueIds = "audioCueIds" in activity.presentation ? activity.presentation.audioCueIds ?? [] : [];
      expect(cueIds).toHaveLength(0);
      expect(activity.narration.trim().length).toBeGreaterThan(0);
    }
  });

  it("scores its own canonical answer correct and a distractor incorrect", () => {
    const answerable = GRADE_ONE_ELA_ACTIVITIES.filter(
      (activity) => activity.purpose !== "INSTRUCTION" && activity.purpose !== "MODELED_EXAMPLE",
    );
    expect(answerable.length).toBeGreaterThan(0);
    for (const activity of answerable) {
      expect(evaluateLessonActivity(activity, activity.canonicalAnswer, []).correct).toBe(true);
      if (activity.presentation.kind === "CHOICE_BOARD" || activity.presentation.kind === "CONTROLLED_TEXT") {
        const distractor = activity.presentation.choices.find((choice) => choice.id !== activity.canonicalAnswer);
        const outcome = evaluateLessonActivity(activity, distractor?.id, []);
        expect(outcome.correct).toBe(false);
        expect(outcome.explanation.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("introduces a skill before it checks it, and reaches mastery for every skill", async () => {
    const run = await masterEverything();
    const progress = await run.repository.listSkillProgress(run.learnerId);
    expect(run.skills.size).toBe(GRADE_ONE_ELA_SKILLS.length);
    expect(progress.filter((record) => record.state === "MASTERED")).toHaveLength(GRADE_ONE_ELA_SKILLS.length);
    expect(run.purposes).toContain("INSTRUCTION");
    expect(run.purposes).toContain("MODELED_EXAMPLE");
    expect(run.purposes).toContain("MASTERY_CHECK");
    expect(run.completionMessage).toBe(gradeOneElaCatalog.completionMessage);
  }, 30_000);

  it("starts a new learner on narrated instruction, not on a test", async () => {
    const repository = new InMemoryProgressRepository();
    const engine = new LessonActivityEngine(gradeOneElaCatalog, repository, () => NOW);
    const selection = await engine.select("fresh-learner", [], 1);
    expect(selection.activity.purpose).toBe("INSTRUCTION");
    expect(selection.activity.presentation.kind).toBe("TUTOR_MESSAGE");
    expect(selection.activity.narration.trim().length).toBeGreaterThan(0);
  });

  it("records lesson evidence against the tested standard identifier", () => {
    const skill = lessonCatalogSkill("ela.g1.rf.3.a.digraphs");
    const primary = skill.standardMappings.find((mapping) => mapping.relationship === "PRIMARY");
    expect(primary?.standardId).toBe("1.RF.3.a");
    expect(primary?.framework).toBe("COMMON_CORE");
  });

  it("is the lesson catalog for Grade 1 reading, and leaves Grade 1 math to the question bank", () => {
    expect(lessonCatalogFor("1", "ELA")?.id).toBe(gradeOneElaCatalog.id);
    expect(lessonCatalogFor("1", "MATH")).toBeUndefined();
  });
});
