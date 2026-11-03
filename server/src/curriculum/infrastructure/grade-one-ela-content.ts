import type { LessonSkillSpec } from "./lesson-activity-builder";
import { GRADE_ONE_FOUNDATION_SPECS } from "./grade-one-ela/foundations";
import { GRADE_ONE_CONVENTION_SPECS } from "./grade-one-ela/conventions";
import { GRADE_ONE_GRAMMAR_SPECS } from "./grade-one-ela/grammar";
import { GRADE_ONE_VOCABULARY_SPECS } from "./grade-one-ela/vocabulary";
import { GRADE_ONE_LITERATURE_SPECS } from "./grade-one-ela/literature";
import { GRADE_ONE_INFORMATION_SPECS } from "./grade-one-ela/information";

/** Every Grade 1 ELA lesson spec, grouped by the strand it teaches. */
export const GRADE_ONE_ELA_SPECS: readonly LessonSkillSpec[] = [
  ...GRADE_ONE_FOUNDATION_SPECS,
  ...GRADE_ONE_CONVENTION_SPECS,
  ...GRADE_ONE_GRAMMAR_SPECS,
  ...GRADE_ONE_VOCABULARY_SPECS,
  ...GRADE_ONE_LITERATURE_SPECS,
  ...GRADE_ONE_INFORMATION_SPECS,
];
