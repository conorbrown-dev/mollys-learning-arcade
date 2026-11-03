import type { ElaSkillDefinition } from "../domain/ela-skill";
import type { LessonCatalog } from "../domain/lesson-catalog";
import {
  KINDERGARTEN_ACTIVITY_EXCLUSION_WINDOW,
  KINDERGARTEN_ELA_ACTIVITIES,
  KINDERGARTEN_ELA_SKILLS,
  KINDERGARTEN_LESSON_RECIPES,
  KINDERGARTEN_MASTERY_POLICY,
  KINDERGARTEN_SESSION_ACTIVITY_LIMIT,
} from "./kindergarten-ela-catalog";
import { validateKindergartenElaCatalog } from "./kindergarten-ela.validator";
import {
  GRADE_ONE_ACTIVITY_EXCLUSION_WINDOW,
  GRADE_ONE_ELA_ACTIVITIES,
  GRADE_ONE_ELA_SKILLS,
  GRADE_ONE_LESSON_RECIPES,
  GRADE_ONE_MASTERY_POLICY,
  GRADE_ONE_SESSION_ACTIVITY_LIMIT,
} from "./grade-one-ela-catalog";
import { validateGradeOneElaCatalog } from "./grade-one-ela.validator";

export const KINDERGARTEN_ELA_CATALOG_ID = "ela.k.short-a";
export const GRADE_ONE_ELA_CATALOG_ID = "ela.grade-1";

export const kindergartenElaCatalog: LessonCatalog = {
  id: KINDERGARTEN_ELA_CATALOG_ID,
  label: "Kindergarten ELA",
  grade: "K",
  subject: "ELA",
  sessionActivityLimit: KINDERGARTEN_SESSION_ACTIVITY_LIMIT,
  activityExclusionWindow: KINDERGARTEN_ACTIVITY_EXCLUSION_WINDOW,
  masteryPolicy: KINDERGARTEN_MASTERY_POLICY,
  recipes: KINDERGARTEN_LESSON_RECIPES,
  skills: KINDERGARTEN_ELA_SKILLS,
  activities: KINDERGARTEN_ELA_ACTIVITIES,
  deliveryContext: "kindergartenVerticalSlice",
  completionMessage: "The reviewed Kindergarten short-a slice is complete. More curriculum is pending review.",
  validate: validateKindergartenElaCatalog,
};

export const gradeOneElaCatalog: LessonCatalog = {
  id: GRADE_ONE_ELA_CATALOG_ID,
  label: "Grade 1 ELA",
  grade: "1",
  subject: "ELA",
  sessionActivityLimit: GRADE_ONE_SESSION_ACTIVITY_LIMIT,
  activityExclusionWindow: GRADE_ONE_ACTIVITY_EXCLUSION_WINDOW,
  masteryPolicy: GRADE_ONE_MASTERY_POLICY,
  recipes: GRADE_ONE_LESSON_RECIPES,
  skills: GRADE_ONE_ELA_SKILLS,
  activities: GRADE_ONE_ELA_ACTIVITIES,
  deliveryContext: "gradeOneElaLesson",
  completionMessage: "Every Grade 1 reading and language skill is mastered. Try the Grade 1 learning check, or move on to Grade 2.",
  validate: validateGradeOneElaCatalog,
};

export const LESSON_CATALOGS: readonly LessonCatalog[] = [kindergartenElaCatalog, gradeOneElaCatalog];

export function lessonCatalogById(catalogId: string | undefined): LessonCatalog {
  // Sessions created before catalogs were named carry no ID and are Kindergarten.
  if (!catalogId) return kindergartenElaCatalog;
  const found = LESSON_CATALOGS.find((catalog) => catalog.id === catalogId);
  if (!found) throw new Error(`Unknown lesson catalog ${catalogId}.`);
  return found;
}

/** The in-app lesson catalog for a grade and subject, when one exists. */
export function lessonCatalogFor(grade: string, subject: string | undefined): LessonCatalog | undefined {
  return LESSON_CATALOGS.find((catalog) => catalog.grade === grade && catalog.subject === subject);
}

/** Looks a skill up across every catalog, so progress views work for any learner. */
export function lessonCatalogSkill(skillId: string): ElaSkillDefinition {
  for (const catalog of LESSON_CATALOGS) {
    const found = catalog.skills.find((skill) => skill.id === skillId);
    if (found) return found;
  }
  throw new Error(`Unknown lesson skill ${skillId}.`);
}

export function catalogForSkill(skillId: string): LessonCatalog {
  const found = LESSON_CATALOGS.find((catalog) => catalog.skills.some((skill) => skill.id === skillId));
  if (!found) throw new Error(`No lesson catalog contains skill ${skillId}.`);
  return found;
}
