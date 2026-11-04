export type ConceptVariant = { question: string; answer: string; choices: string[]; explanation: string };
export type ConceptVariantTable = Record<string, ConceptVariant[]>;

/** Builds a three-choice question; the generators shuffle the choices before showing them. */
export const conceptQuestion = (question: string, answer: string, wrongOne: string, wrongTwo: string, explanation: string): ConceptVariant => ({
  question, answer, choices: [answer, wrongOne, wrongTwo], explanation
});
