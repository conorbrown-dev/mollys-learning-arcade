import type { ElaSkillDefinition, SkillMasteryPolicy } from "./ela-skill";
import type { LearningActivityDefinition, LessonRecipeDefinition } from "./learning-activity";

/**
 * A reviewed body of in-app lesson content for one grade and subject.
 *
 * The lesson engine is catalog-driven: it sequences skills, selects the next
 * activity, and derives mastery from whichever catalog a session is running.
 * Adding a grade means adding a catalog, not branching the engine.
 */
export interface LessonCatalog {
  id: string;
  label: string;
  grade: "K" | "1" | "2";
  subject: "ELA" | "MATH";
  /** Activities served before a session ends. */
  sessionActivityLimit: number;
  /** How many recently seen activity IDs are avoided when selecting the next one. */
  activityExclusionWindow: number;
  masteryPolicy: SkillMasteryPolicy;
  recipes: readonly LessonRecipeDefinition[];
  skills: readonly ElaSkillDefinition[];
  activities: readonly LearningActivityDefinition[];
  /** Recorded on attempts so analytics can tell delivery paths apart. */
  deliveryContext: string;
  /** Shown when every skill in the catalog is mastered. */
  completionMessage: string;
  /** Throws when the catalog is internally inconsistent. */
  validate: () => Promise<void>;
}

export function catalogSkillOrThrow(catalog: LessonCatalog, skillId: string): ElaSkillDefinition {
  const found = catalog.skills.find((skill) => skill.id === skillId);
  if (!found) throw new Error(`Unknown ${catalog.label} skill ${skillId}.`);
  return found;
}
