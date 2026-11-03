import type { ActivityPurpose, EvidenceMode } from "../domain/ela-skill";
import type {
  LearningActivityDefinition,
  LessonChoice,
  LessonPresentation,
  LessonRecipeId,
  LessonStage,
  MisconceptionTag,
} from "../domain/learning-activity";

/**
 * Turns a compact per-skill content spec into the full instruct -> model ->
 * guided -> independent -> mastery -> review activity set the lesson engine
 * expects, so authored content stays readable as curriculum rather than data
 * plumbing.
 */

/** One answerable example. Exactly one of `options`, `cards`, or a `text` passage shapes the presentation. */
export interface LessonItemSpec {
  id: string;
  prompt: string;
  /** Spoken form. Defaults to the prompt. */
  narration?: string;
  /** Choice labels. The correct one is named by `answer`. */
  options?: readonly string[];
  answer?: string;
  /** Scrambled pieces the learner orders. */
  cards?: readonly string[];
  /** Spell a word letter by letter. */
  word?: string;
  /** Order larger pieces, such as syllables, instead of single letters. */
  parts?: readonly string[];
  /** A short passage shown above the choices. */
  text?: string;
  /** What the tutor reads when the learner asks for the strongest support. */
  helpNarration?: string;
  explanation: string;
  /** Overrides the skill-level misconception tag for this item's distractors. */
  misconception?: MisconceptionTag;
}

export interface LessonSkillSpec {
  skillId: string;
  recipeId: LessonRecipeId;
  evidenceMode: EvidenceMode;
  /** Set when independent and mastery work is read rather than heard. */
  independentEvidenceMode?: EvidenceMode;
  /** Groups an item's distractors with its answer so they stay plausible. */
  conceptDomain: string;
  /** Default misconception tag for distractors in this skill. */
  misconception: MisconceptionTag;
  contentScopeId?: string;
  instruction: { prompt: string; narration: string; tutorMessage: string; displayTokens?: readonly string[] };
  model: { prompt: string; narration: string; tutorMessage: string; modelText: string; displayTokens?: readonly string[] };
  guided: readonly LessonItemSpec[];
  independent: readonly LessonItemSpec[];
  mastery: readonly LessonItemSpec[];
  hints?: Partial<Record<"L1_FOCUS" | "L2_CONTRAST" | "L3_PARTIAL" | "L4_MODEL", string>>;
}

const STAGES: Record<ActivityPurpose, LessonStage> = {
  INSTRUCTION: "INTRODUCE",
  MODELED_EXAMPLE: "MODEL",
  GUIDED_PRACTICE: "GUIDED",
  INDEPENDENT_PRACTICE: "INDEPENDENT",
  MASTERY_CHECK: "MASTERY",
  REVIEW: "REVIEW",
};

const TUTOR_MESSAGES: Partial<Record<ActivityPurpose, string>> = {
  GUIDED_PRACTICE: "Let's work this one out together.",
  INDEPENDENT_PRACTICE: "Your turn. Take your time.",
  MASTERY_CHECK: "Show what you know on a fresh one.",
  REVIEW: "A quick look back to keep this strong.",
};

function defaultHints(spec: LessonSkillSpec): Record<string, string> {
  return {
    L1_FOCUS: spec.hints?.L1_FOCUS ?? "Read the question again and look at one choice at a time.",
    L2_CONTRAST: spec.hints?.L2_CONTRAST ?? "Two choices look close. Find the one detail that makes them different.",
    L3_PARTIAL: spec.hints?.L3_PARTIAL ?? "Rule out the choice you are most sure is wrong, then choose between the rest.",
    L4_MODEL: spec.hints?.L4_MODEL ?? "Listen while the tutor works through it, then choose.",
  };
}

/** Positional IDs keep choices unique even when two labels normalize the same way. */
function choicesFor(item: LessonItemSpec, conceptDomain: string, misconception: MisconceptionTag): { choices: LessonChoice[]; answerId: string } {
  const options = item.options ?? [];
  if (options.length < 2) throw new Error(`Item ${item.id} needs at least two choices.`);
  if (!item.answer || !options.includes(item.answer)) throw new Error(`Item ${item.id} must name one of its own choices as the answer.`);
  const answerIndex = options.indexOf(item.answer);
  const choices = options.map((label, index) => ({
    id: `o${index + 1}`,
    label,
    conceptDomain,
    audioText: label,
    ...(index === answerIndex ? {} : { misconception: item.misconception ?? misconception }),
  }));
  return { choices, answerId: `o${answerIndex + 1}` };
}

function presentationFor(item: LessonItemSpec, spec: LessonSkillSpec): { presentation: LessonPresentation; answer: unknown } {
  const orderedParts = item.parts ?? (item.word ? [...item.word] : undefined);
  if (item.cards && orderedParts) {
    if (orderedParts.some((part) => !item.cards!.includes(part))) throw new Error(`Item ${item.id} has an answer part that is not among its cards.`);
    return {
      presentation: { kind: "CARD_WORKSPACE", cards: item.cards, slots: orderedParts.length, wordAudioText: item.word ?? orderedParts.join("") },
      answer: [...orderedParts],
    };
  }
  const { choices, answerId } = choicesFor(item, spec.conceptDomain, spec.misconception);
  if (item.text) {
    return {
      presentation: { kind: "CONTROLLED_TEXT", text: item.text, choices, helpNarration: item.helpNarration ?? item.text },
      answer: answerId,
    };
  }
  return { presentation: { kind: "CHOICE_BOARD", choices }, answer: answerId };
}

function answerable(spec: LessonSkillSpec, purpose: ActivityPurpose, item: LessonItemSpec, suffix: string, review: LearningActivityDefinition["review"]): LearningActivityDefinition {
  const isIndependent = purpose === "INDEPENDENT_PRACTICE" || purpose === "MASTERY_CHECK" || purpose === "REVIEW";
  const { presentation, answer } = presentationFor(item, spec);
  return {
    id: `${spec.skillId}.${purpose.toLowerCase()}.${suffix}`,
    version: 1,
    primarySkillId: spec.skillId,
    supportingSkillIds: [],
    purpose,
    recipeId: spec.recipeId,
    stage: STAGES[purpose],
    ...(spec.contentScopeId ? { contentScopeId: spec.contentScopeId } : {}),
    evidenceMode: isIndependent ? spec.independentEvidenceMode ?? spec.evidenceMode : spec.evidenceMode,
    prompt: item.prompt,
    narration: item.narration ?? item.prompt,
    tutorMessage: TUTOR_MESSAGES[purpose] ?? "Try this one.",
    tutorState: purpose === "GUIDED_PRACTICE" ? "POINTING" : "IDLE",
    presentation,
    canonicalAnswer: answer,
    explanation: item.explanation,
    hintMessages: defaultHints(spec),
    targetConceptDomain: spec.conceptDomain,
    review,
  };
}

export function buildLessonActivities(spec: LessonSkillSpec, review: LearningActivityDefinition["review"]): LearningActivityDefinition[] {
  const teaching = (purpose: "INSTRUCTION" | "MODELED_EXAMPLE", presentation: LessonPresentation, content: { prompt: string; narration: string; tutorMessage: string }): LearningActivityDefinition => ({
    id: `${spec.skillId}.${purpose === "INSTRUCTION" ? "instruction" : "modeled"}`,
    version: 1,
    primarySkillId: spec.skillId,
    supportingSkillIds: [],
    purpose,
    recipeId: spec.recipeId,
    stage: STAGES[purpose],
    ...(spec.contentScopeId ? { contentScopeId: spec.contentScopeId } : {}),
    evidenceMode: spec.evidenceMode,
    prompt: content.prompt,
    narration: content.narration,
    tutorMessage: content.tutorMessage,
    tutorState: purpose === "INSTRUCTION" ? "SPEAKING" : "POINTING",
    presentation,
    canonicalAnswer: null,
    explanation: purpose === "INSTRUCTION" ? "Instruction completed." : "Modeled example completed.",
    hintMessages: {},
    review,
  });

  return [
    teaching("INSTRUCTION", { kind: "TUTOR_MESSAGE", ...(spec.instruction.displayTokens ? { displayTokens: spec.instruction.displayTokens } : {}) }, spec.instruction),
    teaching("MODELED_EXAMPLE", { kind: "TUTOR_MESSAGE", modelText: spec.model.modelText, ...(spec.model.displayTokens ? { displayTokens: spec.model.displayTokens } : {}) }, spec.model),
    ...spec.guided.map((item) => answerable(spec, "GUIDED_PRACTICE", item, item.id, review)),
    ...spec.independent.map((item) => answerable(spec, "INDEPENDENT_PRACTICE", item, item.id, review)),
    ...spec.mastery.map((item) => answerable(spec, "MASTERY_CHECK", item, item.id, review)),
    ...spec.independent.slice(0, 2).map((item) => answerable(spec, "REVIEW", item, `review-${item.id}`, review)),
  ];
}

/** Authoring helper: a plain choice question. */
export const choiceItem = (id: string, prompt: string, answer: string, options: readonly string[], explanation: string, narration?: string): LessonItemSpec =>
  ({ id, prompt, answer, options, explanation, ...(narration ? { narration } : {}) });

/** Authoring helper: a short passage shown and read aloud, then a question about it. */
export const passageItem = (id: string, text: string, prompt: string, answer: string, options: readonly string[], explanation: string): LessonItemSpec =>
  ({ id, text, prompt, answer, options, explanation, narration: `${text} ${prompt}`, helpNarration: text });

/** Authoring helper: order the letter cards to spell the word. */
export const buildWordItem = (id: string, prompt: string, word: string, cards: readonly string[], explanation: string, narration?: string): LessonItemSpec =>
  ({ id, prompt, word, cards, explanation, ...(narration ? { narration } : {}) });

/** Authoring helper: order larger pieces, such as syllables, into a word. */
export const orderPartsItem = (id: string, prompt: string, word: string, parts: readonly string[], cards: readonly string[], explanation: string, narration?: string): LessonItemSpec =>
  ({ id, prompt, word, parts, cards, explanation, ...(narration ? { narration } : {}) });
