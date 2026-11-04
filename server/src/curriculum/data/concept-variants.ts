import type { ConceptVariantTable } from "./concept-question";
import { gradeOneConceptVariants } from "./concept-variants-grade-one";
import { gradeTwoConceptVariants } from "./concept-variants-grade-two";
import { kindergartenConceptVariants } from "./concept-variants-kindergarten";

const tables: ConceptVariantTable[] = [kindergartenConceptVariants, gradeOneConceptVariants, gradeTwoConceptVariants];

/** Extra questions for a standard, each testing a different idea from the same standard. */
export const conceptVariantsFor = (standardId: string) => tables.flatMap((table) => table[standardId] ?? []);
