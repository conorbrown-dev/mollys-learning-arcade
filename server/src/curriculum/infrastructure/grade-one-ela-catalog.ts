import type { DecodableScope } from "../domain/decodable-scope";
import type { ElaSkillDefinition, SkillMasteryPolicy } from "../domain/ela-skill";
import type { LearningActivityDefinition, LessonRecipeDefinition } from "../domain/learning-activity";
import { buildLessonActivities, type LessonSkillSpec } from "./lesson-activity-builder";
import { GRADE_ONE_ELA_SPECS } from "./grade-one-ela-content";

/**
 * Grade 1 English Language Arts: in-app instruction for every Grade 1 ELA
 * standard the proficiency test draws on.
 *
 * Everything here runs on screen. Prompts are narrated by the existing model
 * TTS service, visuals are text and emoji, and no activity needs letter cards,
 * counters, or any other physical material. Offline, adult-led work belongs in
 * the family's own homeschool time, not in this catalog.
 *
 * Standards are mapped Common Core first because the Grade 1 question bank and
 * the proficiency test are keyed to those identifiers; mastery earned in a
 * lesson therefore counts toward the same standard the test measures. The
 * Oklahoma academic standard is carried alongside it for state alignment.
 */

const REVIEW = {
  status: "validated" as const,
  reviewer: "Grade 1 in-app lesson authoring",
  reviewedAt: "2026-11-03",
  notes: "Screen-only Grade 1 ELA instruction mapped to the Grade 1 proficiency-test standards. Pending family curriculum review.",
};

export const GRADE_ONE_SESSION_ACTIVITY_LIMIT = 10;
export const GRADE_ONE_ACTIVITY_EXCLUSION_WINDOW = 20;

export const GRADE_ONE_LESSON_RECIPES: readonly LessonRecipeDefinition[] = [
  { id: "ela.auditory-contrast.v1", version: 1, supportedPresentationKinds: ["TUTOR_MESSAGE", "CHOICE_BOARD"], supportedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"] },
  { id: "ela.symbol-sound.v1", version: 1, supportedPresentationKinds: ["TUTOR_MESSAGE", "CHOICE_BOARD"], supportedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"] },
  { id: "ela.phoneme-sequence.v1", version: 1, supportedPresentationKinds: ["TUTOR_MESSAGE", "CHOICE_BOARD", "CARD_WORKSPACE"], supportedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"] },
  { id: "ela.word-mapping.v1", version: 1, supportedPresentationKinds: ["TUTOR_MESSAGE", "CHOICE_BOARD", "CARD_WORKSPACE"], supportedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"] },
  { id: "ela.print-feature.v1", version: 1, supportedPresentationKinds: ["TUTOR_MESSAGE", "CHOICE_BOARD"], supportedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"] },
  { id: "ela.controlled-sentence.v1", version: 1, supportedPresentationKinds: ["TUTOR_MESSAGE", "CHOICE_BOARD", "CONTROLLED_TEXT"], supportedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"] },
];

/**
 * Word-building work stays inside Grade 1 phonics: short and long vowels,
 * consonant blends, common digraphs, silent e, and inflectional endings.
 */
export const GRADE_ONE_DECODABLE_SCOPE: DecodableScope = {
  id: "ela.scope.grade-1.phonics",
  allowedGraphemes: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  regularWords: [
    "bat", "bed", "big", "box", "bug", "cat", "cup", "dog", "fan", "fin", "fix", "fun", "hat", "hop", "hot", "hug", "jam", "jet", "kid", "lap", "leg", "lid", "lot", "mad", "map", "men", "mop", "mud", "net", "nut", "pan", "pen", "pig", "pot", "rug", "run", "sad", "sit", "sun", "tap", "ten", "top", "web", "wet", "win", "zip",
    "bake", "bike", "cake", "cape", "cave", "cute", "dime", "five", "home", "hope", "kite", "lake", "lime", "made", "mule", "name", "nine", "note", "pine", "ride", "rope", "rule", "side", "tape", "time", "vine", "wave",
    "chat", "chin", "chip", "chop", "dish", "fish", "shed", "ship", "shop", "shut", "such", "thin", "this", "with", "when", "whip", "bath", "math", "path", "rich", "wish",
    "blot", "clap", "clip", "club", "crab", "drum", "flag", "flat", "flip", "frog", "glad", "grab", "grin", "plan", "plus", "slip", "snap", "spin", "stop", "swim", "trap", "trip",
    "bend", "best", "fast", "hand", "jump", "land", "last", "lamp", "mask", "melt", "milk", "mist", "nest", "pond", "sand", "send", "sink", "soft", "tent", "test", "wind",
    "jumps", "jumped", "jumping", "hops", "hopped", "hopping", "naps", "napped", "napping", "plays", "played", "playing", "rests", "rested", "resting", "wants", "wanted", "wanting",
    "cannot", "napkin", "picnic", "rabbit", "sunset", "muffin", "basket", "kitten", "mitten", "button", "puppet", "tennis", "magnet", "helmet",
  ],
  textOnlyWords: [
    "a", "the", "to", "of", "and", "is", "it", "in", "on", "at", "he", "she", "we", "they", "you", "i", "was", "were", "are", "said", "says", "have", "has", "had", "do", "does", "did", "her", "his", "their", "my", "me", "him", "them", "there", "here", "then", "than", "that", "what", "who", "where", "when", "why", "one", "two", "three", "some", "come", "from", "put", "want", "could", "would", "should", "s",
  ],
  prohibitedPatterns: ["tion", "ough", "augh", "cious", "tious"],
};

export const GRADE_ONE_MASTERY_POLICY: SkillMasteryPolicy = {
  id: "ela.mastery.grade-1.v1",
  guidedSuccessfulExamples: 2,
  independentSuccessfulExamples: 2,
  masterySuccessfulExamples: 2,
  maximumMasteryAttempts: 3,
  masteryPermittedEvidenceModes: ["SPOKEN_ONLY", "LISTENING", "VISUAL_PRINT_WITH_NARRATED_DIRECTIONS", "SUPPORTED_READING", "INDEPENDENT_READING"],
};

function mappings(commonCore: string, oklahoma: string) {
  return [
    { standardId: commonCore, framework: "COMMON_CORE" as const, relationship: "PRIMARY" as const },
    { standardId: oklahoma, framework: "OKLAHOMA" as const, relationship: "SUPPORTING" as const },
  ];
}

const HEARD = { independentReading: "NONE" as const, audio: "REQUIRED" as const };
const PRINT = { independentReading: "OPTIONAL" as const, audio: "SUPPORTED" as const };
const READ = { independentReading: "REQUIRED" as const, audio: "SUPPORTED" as const };

function skill(
  id: string,
  name: string,
  domain: string,
  competency: string,
  prerequisiteSkillIds: readonly string[],
  sequenceRank: number,
  importance: ElaSkillDefinition["importance"],
  standardMappings: ReturnType<typeof mappings>,
  delivery: ElaSkillDefinition["delivery"],
  contentScopeId?: string,
): ElaSkillDefinition {
  return {
    id,
    version: 1,
    name,
    domain,
    competency,
    prerequisiteSkillIds,
    sequenceRank,
    importance,
    standardMappings,
    masteryPolicyId: GRADE_ONE_MASTERY_POLICY.id,
    ...(contentScopeId ? { contentScopeId } : {}),
    allowedPurposes: ["INSTRUCTION", "MODELED_EXAMPLE", "GUIDED_PRACTICE", "INDEPENDENT_PRACTICE", "MASTERY_CHECK", "REVIEW"],
    delivery,
    review: { status: REVIEW.status, reviewer: REVIEW.reviewer, reviewedAt: REVIEW.reviewedAt, notes: REVIEW.notes },
  };
}

const SCOPE = GRADE_ONE_DECODABLE_SCOPE.id;

export const GRADE_ONE_ELA_SKILLS: readonly ElaSkillDefinition[] = [
  // Phonological awareness
  skill("ela.g1.rf.2.a.vowel-sounds", "Hear long and short vowels", "Sound awareness", "Vowel sound discrimination", [], 10, "FOUNDATIONAL", mappings("1.RF.2.a", "1.2.PA.3"), HEARD),
  skill("ela.g1.rf.2.c.isolate-phonemes", "Pick out one sound in a word", "Sound awareness", "Phoneme isolation", [], 20, "FOUNDATIONAL", mappings("1.RF.2.c", "1.2.PA.3"), HEARD),
  skill("ela.g1.rf.2.b.blending", "Blend sounds into a word", "Sound awareness", "Phoneme blending", ["ela.g1.rf.2.c.isolate-phonemes"], 30, "FOUNDATIONAL", mappings("1.RF.2.b", "1.2.PA.4"), HEARD),
  skill("ela.g1.rf.2.d.segment-phonemes", "Break a word into its sounds", "Sound awareness", "Phoneme segmentation", ["ela.g1.rf.2.c.isolate-phonemes"], 40, "FOUNDATIONAL", mappings("1.RF.2.d", "1.2.PA.5"), HEARD),
  // Phonics and word reading
  skill("ela.g1.rf.3.a.digraphs", "Read two letters that make one sound", "Phonics", "Consonant digraphs", ["ela.g1.rf.2.c.isolate-phonemes"], 50, "FOUNDATIONAL", mappings("1.RF.3.a", "1.2.PWS.1"), PRINT, SCOPE),
  skill("ela.g1.rf.3.b.one-syllable-decode", "Read one-syllable words", "Phonics", "One-syllable decoding", ["ela.g1.rf.3.a.digraphs", "ela.g1.rf.2.b.blending"], 60, "FOUNDATIONAL", mappings("1.RF.3.b", "1.2.PWS.1"), READ, SCOPE),
  skill("ela.g1.rf.3.c.long-vowels", "Read words with silent e", "Phonics", "Long vowel patterns", ["ela.g1.rf.3.b.one-syllable-decode"], 70, "FOUNDATIONAL", mappings("1.RF.3.c", "1.2.PWS.1"), READ, SCOPE),
  skill("ela.g1.rf.3.d.syllables", "Count syllables by their vowels", "Phonics", "Syllable awareness", ["ela.g1.rf.2.a.vowel-sounds"], 80, "FOUNDATIONAL", mappings("1.RF.3.d", "1.2.PA.1"), HEARD),
  skill("ela.g1.rf.3.e.two-syllable-decode", "Read two-syllable words", "Phonics", "Two-syllable decoding", ["ela.g1.rf.3.d.syllables", "ela.g1.rf.3.c.long-vowels"], 90, "FOUNDATIONAL", mappings("1.RF.3.e", "1.2.PWS.2"), READ, SCOPE),
  skill("ela.g1.rf.3.f.inflectional-endings", "Read word endings", "Phonics", "Inflectional endings", ["ela.g1.rf.3.b.one-syllable-decode"], 100, "FOUNDATIONAL", mappings("1.RF.3.f", "1.2.PWS.3"), READ, SCOPE),
  skill("ela.g1.rf.3.g.irregular-words", "Read tricky words by sight", "Phonics", "Irregular word reading", ["ela.g1.rf.3.b.one-syllable-decode"], 110, "FOUNDATIONAL", mappings("1.RF.3.g", "1.2.SE.2"), READ),
  skill("ela.g1.rf.1.a.sentence-features", "Spot the parts of a sentence", "Print concepts", "Sentence features", [], 120, "CORE", mappings("1.RF.1.a", "1.2.PC.1"), PRINT),
  // Conventions
  skill("ela.g1.l.2.a.capitalization", "Use capital letters", "Conventions", "Capitalization", ["ela.g1.rf.1.a.sentence-features"], 130, "CORE", mappings("1.L.2.a", "1.5.W.3"), PRINT),
  skill("ela.g1.l.2.b.end-punctuation", "Choose the end mark", "Conventions", "End punctuation", ["ela.g1.rf.1.a.sentence-features"], 140, "CORE", mappings("1.L.2.b", "1.5.W.4"), PRINT),
  skill("ela.g1.l.2.c.commas", "Use commas in a list", "Conventions", "Commas", ["ela.g1.l.2.b.end-punctuation"], 150, "CORE", mappings("1.L.2.c", "1.5.W.4"), PRINT),
  skill("ela.g1.l.2.d.spelling-patterns", "Spell the sounds you hear", "Conventions", "Spelling patterns", ["ela.g1.rf.3.a.digraphs"], 160, "CORE", mappings("1.L.2.d", "1.2.SE.1"), PRINT, SCOPE),
  // Grammar
  skill("ela.g1.l.1.b.nouns", "Find naming words", "Grammar", "Nouns", ["ela.g1.rf.1.a.sentence-features"], 170, "CORE", mappings("1.L.1.b", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.f.adjectives", "Find describing words", "Grammar", "Adjectives", ["ela.g1.l.1.b.nouns"], 180, "CORE", mappings("1.L.1.f", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.e.verb-tense", "Tell when something happens", "Grammar", "Verb tense", ["ela.g1.l.1.b.nouns"], 190, "CORE", mappings("1.L.1.e", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.c.noun-verb-agreement", "Match the naming word and the action", "Grammar", "Subject-verb agreement", ["ela.g1.l.1.e.verb-tense"], 200, "CORE", mappings("1.L.1.c", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.d.pronouns", "Use words that stand in for names", "Grammar", "Pronouns", ["ela.g1.l.1.b.nouns"], 210, "CORE", mappings("1.L.1.d", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.h.determiners", "Use words that point to a noun", "Grammar", "Determiners", ["ela.g1.l.1.b.nouns"], 220, "SUPPORTING", mappings("1.L.1.h", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.i.prepositions", "Tell where and when", "Grammar", "Prepositions", ["ela.g1.l.1.b.nouns"], 230, "SUPPORTING", mappings("1.L.1.i", "1.5.R.2"), PRINT),
  skill("ela.g1.l.1.g.conjunctions", "Join two ideas", "Grammar", "Conjunctions", ["ela.g1.l.1.b.nouns"], 240, "SUPPORTING", mappings("1.L.1.g", "1.5.R.2"), PRINT),
  // Vocabulary
  skill("ela.g1.l.4.a.context-clues", "Use the sentence to find a meaning", "Vocabulary", "Context clues", [], 250, "CORE", mappings("1.L.4.a", "1.4.R.2"), PRINT),
  skill("ela.g1.l.4.b.affixes", "Use word beginnings and endings", "Vocabulary", "Affixes", ["ela.g1.rf.3.f.inflectional-endings"], 260, "SUPPORTING", mappings("1.L.4.b", "1.4.R.3"), PRINT),
  skill("ela.g1.l.4.c.root-words", "Find the root word", "Vocabulary", "Root words", ["ela.g1.l.4.b.affixes"], 270, "SUPPORTING", mappings("1.L.4.c", "1.4.R.3"), PRINT),
  skill("ela.g1.l.5.a.categories", "Sort words into groups", "Vocabulary", "Categories", [], 280, "SUPPORTING", mappings("1.L.5.a", "1.4.R.5"), PRINT),
  skill("ela.g1.l.5.b.word-definitions", "Explain what a word means", "Vocabulary", "Word meaning", ["ela.g1.l.5.a.categories"], 290, "SUPPORTING", mappings("1.L.5.b", "1.4.R.5"), PRINT),
  skill("ela.g1.l.5.d.shades-of-meaning", "Tell close words apart", "Vocabulary", "Shades of meaning", ["ela.g1.l.5.b.word-definitions"], 300, "SUPPORTING", mappings("1.L.5.d", "1.4.R.1"), PRINT),
  skill("ela.g1.l.6.acquired-words", "Use new words you have learned", "Vocabulary", "Word use", ["ela.g1.l.5.b.word-definitions"], 310, "SUPPORTING", mappings("1.L.6", "1.4.R.5"), PRINT),
  // Literature
  skill("ela.g1.rl.1.key-details", "Answer questions about a story", "Reading literature", "Key details", [], 320, "CORE", mappings("1.RL.1", "1.3.R.4"), READ),
  skill("ela.g1.rl.3.story-elements", "Describe characters and setting", "Reading literature", "Story elements", ["ela.g1.rl.1.key-details"], 330, "CORE", mappings("1.RL.3", "1.3.R.3"), READ),
  skill("ela.g1.rl.2.lesson", "Find the lesson in a story", "Reading literature", "Central message", ["ela.g1.rl.3.story-elements"], 340, "SUPPORTING", mappings("1.RL.2", "1.2.R.1"), READ),
  skill("ela.g1.rl.4.feeling-words", "Notice feeling words", "Reading literature", "Word feeling", ["ela.g1.rl.1.key-details"], 350, "SUPPORTING", mappings("1.RL.4", "1.4.R.5"), READ),
  skill("ela.g1.rl.5.text-types", "Tell a story from a facts book", "Reading literature", "Text types", [], 360, "SUPPORTING", mappings("1.RL.5", "1.2.R.2"), PRINT),
  skill("ela.g1.rl.6.narrator", "Tell who is speaking", "Reading literature", "Narrator", ["ela.g1.rl.1.key-details"], 370, "SUPPORTING", mappings("1.RL.6", "1.3.R.2"), READ),
  skill("ela.g1.rl.7.story-illustrations", "Use pictures and words together", "Reading literature", "Illustrations", ["ela.g1.rl.1.key-details"], 380, "SUPPORTING", mappings("1.RL.7", "1.6.R.2"), READ),
  skill("ela.g1.rl.9.compare-characters", "Compare two characters", "Reading literature", "Comparison", ["ela.g1.rl.3.story-elements"], 390, "SUPPORTING", mappings("1.RL.9", "1.3.R.3"), READ),
  // Informational text
  skill("ela.g1.ri.1.key-details", "Answer questions about a facts text", "Reading information", "Key details", [], 400, "CORE", mappings("1.RI.1", "1.3.R.4"), READ),
  skill("ela.g1.ri.2.main-topic", "Find what a text is mostly about", "Reading information", "Main topic", ["ela.g1.ri.1.key-details"], 410, "CORE", mappings("1.RI.2", "1.2.R.1"), READ),
  skill("ela.g1.ri.3.connections", "Connect two facts", "Reading information", "Connections", ["ela.g1.ri.1.key-details"], 420, "SUPPORTING", mappings("1.RI.3", "1.3.R.6"), READ),
  skill("ela.g1.ri.4.word-meaning", "Find a word's meaning in a facts text", "Reading information", "Word meaning", ["ela.g1.l.4.a.context-clues"], 430, "SUPPORTING", mappings("1.RI.4", "1.4.R.2"), READ),
  skill("ela.g1.ri.5.text-features", "Use headings and other text parts", "Reading information", "Text features", [], 440, "SUPPORTING", mappings("1.RI.5", "1.6.R.3"), PRINT),
  skill("ela.g1.ri.6.words-and-pictures", "Tell what the words say from what the picture shows", "Reading information", "Words and pictures", ["ela.g1.ri.5.text-features"], 450, "SUPPORTING", mappings("1.RI.6", "1.6.R.2"), PRINT),
  skill("ela.g1.ri.7.illustration-details", "Use a picture to learn more", "Reading information", "Illustrations", ["ela.g1.ri.1.key-details"], 460, "SUPPORTING", mappings("1.RI.7", "1.6.R.2"), READ),
  skill("ela.g1.ri.8.reasons", "Find the reason an author gives", "Reading information", "Author reasons", ["ela.g1.ri.2.main-topic"], 470, "SUPPORTING", mappings("1.RI.8", "1.3.R.5"), READ),
  skill("ela.g1.ri.9.compare-texts", "Compare two facts texts", "Reading information", "Comparison", ["ela.g1.ri.2.main-topic"], 480, "SUPPORTING", mappings("1.RI.9", "1.2.R.4"), READ),
];

export const GRADE_ONE_ELA_ACTIVITIES: readonly LearningActivityDefinition[] = GRADE_ONE_ELA_SPECS.flatMap((spec: LessonSkillSpec) =>
  buildLessonActivities(spec, { status: REVIEW.status, reviewer: REVIEW.reviewer, reviewedAt: REVIEW.reviewedAt }),
);

export function gradeOneElaSkill(skillId: string): ElaSkillDefinition {
  const found = GRADE_ONE_ELA_SKILLS.find((item) => item.id === skillId);
  if (!found) throw new Error(`Unknown Grade 1 ELA skill ${skillId}.`);
  return found;
}
