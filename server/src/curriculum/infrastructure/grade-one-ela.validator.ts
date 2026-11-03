import { assertDecodableText } from "../domain/decodable-scope";
import { ACTIVITY_PURPOSES } from "../domain/ela-skill";
import type { LearningActivityDefinition } from "../domain/learning-activity";
import { validateDistractors } from "./kindergarten-ela.validator";
import {
  GRADE_ONE_DECODABLE_SCOPE,
  GRADE_ONE_ELA_ACTIVITIES,
  GRADE_ONE_ELA_SKILLS,
  GRADE_ONE_LESSON_RECIPES,
} from "./grade-one-ela-catalog";
import { loadLearningStandards } from "./learning-standards";

/**
 * Grade 1 passages are read aloud by the tutor, so they are held to a
 * readability bound rather than the strict decodable word list used for
 * Kindergarten. Word-building activities still have to stay inside the Grade 1
 * phonics scope, because there the spelling itself is the thing being taught.
 */
const MAX_PASSAGE_WORDS = 45;
const MAX_PASSAGE_SENTENCES = 4;
const MAX_WORD_LENGTH = 12;

function assertUnique(values: readonly string[], label: string): void {
  const duplicate = values.find((value, index) => values.indexOf(value) !== index);
  if (duplicate) throw new Error(`Duplicate ${label}: ${duplicate}.`);
}

function assertAcyclic(): void {
  const byId = new Map(GRADE_ONE_ELA_SKILLS.map((skill) => [skill.id, skill]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (skillId: string): void => {
    if (visiting.has(skillId)) throw new Error(`Grade 1 ELA prerequisite cycle includes ${skillId}.`);
    if (visited.has(skillId)) return;
    const skill = byId.get(skillId);
    if (!skill) throw new Error(`Unknown Grade 1 prerequisite skill ${skillId}.`);
    visiting.add(skillId);
    skill.prerequisiteSkillIds.forEach(visit);
    visiting.delete(skillId);
    visited.add(skillId);
  };
  GRADE_ONE_ELA_SKILLS.forEach((skill) => visit(skill.id));
}

/** At least one skill must be reachable from a blank slate, or no learner can start. */
function assertHasEntryPoint(): void {
  if (!GRADE_ONE_ELA_SKILLS.some((skill) => skill.prerequisiteSkillIds.length === 0)) {
    throw new Error("Grade 1 ELA has no skill a new learner can start with.");
  }
}

function assertReadablePassage(activity: LearningActivityDefinition, text: string): void {
  const words = text.trim().split(/\s+/);
  if (words.length > MAX_PASSAGE_WORDS) throw new Error(`Activity ${activity.id} has a ${words.length}-word passage; Grade 1 passages stay at or under ${MAX_PASSAGE_WORDS}.`);
  const sentences = text.split(/[.!?]+/).filter((part) => part.trim().length > 0);
  if (sentences.length > MAX_PASSAGE_SENTENCES) throw new Error(`Activity ${activity.id} has ${sentences.length} sentences; Grade 1 passages stay at or under ${MAX_PASSAGE_SENTENCES}.`);
  const longWord = words.map((word) => word.replace(/[^A-Za-z']/g, "")).find((word) => word.length > MAX_WORD_LENGTH);
  if (longWord) throw new Error(`Activity ${activity.id} uses ${longWord}, which is longer than Grade 1 passages allow.`);
  const prohibited = GRADE_ONE_DECODABLE_SCOPE.prohibitedPatterns.find((pattern) => text.toLowerCase().includes(pattern));
  if (prohibited) throw new Error(`Activity ${activity.id} uses the out-of-scope pattern ${prohibited}.`);
}

function validateActivity(activity: LearningActivityDefinition): void {
  if (!GRADE_ONE_ELA_SKILLS.some((skill) => skill.id === activity.primarySkillId)) throw new Error(`Activity ${activity.id} targets an unknown Grade 1 skill.`);
  const recipe = GRADE_ONE_LESSON_RECIPES.find((candidate) => candidate.id === activity.recipeId);
  if (!recipe) throw new Error(`Activity ${activity.id} references unknown recipe ${activity.recipeId}.`);
  if (!recipe.supportedPurposes.includes(activity.purpose)) throw new Error(`Recipe ${recipe.id} does not support ${activity.purpose}.`);
  if (!recipe.supportedPresentationKinds.includes(activity.presentation.kind)) throw new Error(`Recipe ${recipe.id} does not support ${activity.presentation.kind}.`);
  if (!activity.narration.trim()) throw new Error(`Activity ${activity.id} has no narration, so it cannot be read aloud.`);

  if ("audioCueIds" in activity.presentation && (activity.presentation.audioCueIds?.length ?? 0) > 0) {
    throw new Error(`Activity ${activity.id} references recorded phoneme audio; Grade 1 content is narrated by the TTS service instead.`);
  }
  if (activity.presentation.kind === "CHOICE_BOARD" && activity.targetConceptDomain) {
    validateDistractors(activity.targetConceptDomain, activity.presentation.choices, activity.canonicalAnswer);
  }
  if (activity.presentation.kind === "CONTROLLED_TEXT") {
    assertReadablePassage(activity, activity.presentation.text);
    if (activity.targetConceptDomain) validateDistractors(activity.targetConceptDomain, activity.presentation.choices, activity.canonicalAnswer);
  }
  if (activity.presentation.kind === "CARD_WORKSPACE") {
    const { cards, slots, wordAudioText } = activity.presentation;
    if (!Array.isArray(activity.canonicalAnswer) || activity.canonicalAnswer.length !== slots) throw new Error(`Activity ${activity.id} has ${slots} slots but a different number of answer parts.`);
    if (activity.canonicalAnswer.some((part) => !cards.includes(part as string))) throw new Error(`Activity ${activity.id} expects an answer part that is not on a card.`);
    if (wordAudioText) assertDecodableText(wordAudioText, GRADE_ONE_DECODABLE_SCOPE);
  }
}

export async function validateGradeOneElaCatalog(): Promise<void> {
  assertUnique(GRADE_ONE_LESSON_RECIPES.map((recipe) => `${recipe.id}@${recipe.version}`), "Grade 1 lesson recipe version");
  assertUnique(GRADE_ONE_ELA_SKILLS.map((skill) => `${skill.id}@${skill.version}`), "Grade 1 skill version");
  assertUnique(GRADE_ONE_ELA_ACTIVITIES.map((activity) => `${activity.id}@${activity.version}`), "Grade 1 activity version");
  assertAcyclic();
  assertHasEntryPoint();

  const standardIds = new Set((await loadLearningStandards()).map((standard) => standard.officialId));
  GRADE_ONE_ELA_SKILLS.forEach((skill) => {
    skill.standardMappings.forEach((mapping) => {
      if (!standardIds.has(mapping.standardId)) throw new Error(`Grade 1 skill ${skill.id} maps unknown standard ${mapping.standardId}.`);
    });
    if (skill.standardMappings.filter((mapping) => mapping.relationship === "PRIMARY").length !== 1) {
      throw new Error(`Grade 1 skill ${skill.id} needs exactly one primary standard so lesson evidence lands on the tested standard.`);
    }
    ACTIVITY_PURPOSES.forEach((purpose) => {
      const count = GRADE_ONE_ELA_ACTIVITIES.filter((activity) => activity.primarySkillId === skill.id && activity.purpose === purpose).length;
      const minimum = purpose === "GUIDED_PRACTICE" || purpose === "REVIEW" ? 2 : purpose === "INDEPENDENT_PRACTICE" || purpose === "MASTERY_CHECK" ? 3 : 1;
      if (count < minimum) throw new Error(`Grade 1 skill ${skill.id} needs ${minimum} ${purpose} activities; found ${count}.`);
    });
  });
  GRADE_ONE_ELA_ACTIVITIES.forEach(validateActivity);
}
