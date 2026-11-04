import { conceptVariantsFor } from "../data/concept-variants";
import { gradeOneConceptVariants } from "../data/concept-variants-grade-one";
import { gradeTwoConceptVariants } from "../data/concept-variants-grade-two";
import { kindergartenConceptVariants } from "../data/concept-variants-kindergarten";
import { loadK2ContentCatalog } from "../infrastructure/k2-content-catalog";
import { catalogTemplateToQuestionTemplate } from "../infrastructure/k2-review-packet";
import { diagnosticQuestionFingerprint } from "./diagnostic-question-fingerprint";
import { generateQuestion } from "./question-generator";

const tables = { K: kindergartenConceptVariants, "1": gradeOneConceptVariants, "2": gradeTwoConceptVariants };
const minimumDistinctQuestions = 5;

describe("concept variants", () => {
  for (const [grade, table] of Object.entries(tables)) it(`grade ${grade} questions are well formed`, () => {
    for (const [standardId, variants] of Object.entries(table)) {
      expect(variants.length).toBeGreaterThanOrEqual(3);
      const questions = new Set<string>();
      for (const variant of variants) {
        expect(variant.question.trim()).not.toBe("");
        expect(variant.explanation.trim()).not.toBe("");
        expect(variant.choices).toHaveLength(3);
        // The answer checker ignores case and spacing, so choices that differ only that way would be ambiguous.
        expect(new Set(variant.choices.map((choice) => choice.trim().toLowerCase())).size).toBe(3);
        expect(variant.choices).toContain(variant.answer);
        expect(questions.has(variant.question)).toBe(false);
        questions.add(variant.question);
      }
      expect(standardId).toMatch(/^(K|1|2)\./);
    }
  });

  it("only belongs to standards that have a reviewed diagnostic template", async () => {
    const catalog = await loadK2ContentCatalog();
    const standards = new Set(catalog.templates.filter((template) => template.review.status === "reviewed" && template.diagnosticEligible).map((template) => template.standardId));
    for (const table of Object.values(tables)) for (const standardId of Object.keys(table)) expect(standards.has(standardId)).toBe(true);
    expect(conceptVariantsFor("K.G.A.2").length).toBeGreaterThan(0);
    expect(conceptVariantsFor("not-a-standard")).toEqual([]);
  });

  it("gives every Reading, Language, and Math standard enough genuinely different questions for a full diagnostic", async () => {
    const catalog = await loadK2ContentCatalog();
    const templates = catalog.templates
      .filter((template) => template.review.status === "reviewed" && template.diagnosticEligible && !template.generatorKind.endsWith("Adult") && (template.subject === "ela" || template.subject === "math"))
      .map(catalogTemplateToQuestionTemplate);
    const distinctByStandard = new Map<string, Set<string>>();
    for (const template of templates) {
      const key = `${template.subject}/${template.grade}/${template.primaryStandardId}`;
      const seen = distinctByStandard.get(key) ?? new Set<string>();
      for (let offset = 0; offset < 100; offset += 1) seen.add(diagnosticQuestionFingerprint(generateQuestion(template, `42:0:0:${template.id}:${offset}`)));
      distinctByStandard.set(key, seen);
    }
    const thin = [...distinctByStandard].filter(([, seen]) => seen.size < minimumDistinctQuestions).map(([key, seen]) => `${key}=${seen.size}`);
    expect(thin).toEqual([]);
  });
});
