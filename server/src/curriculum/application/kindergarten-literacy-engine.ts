/**
 * Kindergarten binding for the catalog-driven lesson engine.
 *
 * The engine itself lives in lesson-activity-engine.ts and serves every grade.
 * This module keeps the Kindergarten-shaped API that the short-a vertical slice
 * and its simulation were written against.
 */
import type { ProgressRepository } from "../domain/progress.repository";
import type { SkillEvidenceEvent, SkillProgressRecord } from "../domain/skill-progress";
import type { LearningActivityDefinition, SupportLevel } from "../domain/learning-activity";
import { kindergartenElaCatalog } from "../infrastructure/lesson-catalogs";
import {
  LessonActivityEngine,
  activityByCheckpoint,
  activityView,
  evaluateLessonActivity,
  selectLessonActivity,
  type ActivitySelection,
  type EvaluationResult,
  type LessonActivityCheckpoint,
  type LessonRecordResult,
} from "./lesson-activity-engine";

export type KindergartenActivityCheckpoint = LessonActivityCheckpoint;
export type KindergartenRecordResult = LessonRecordResult;
export type { ActivitySelection, EvaluationResult };
export { activityByCheckpoint, activityView };

export function selectKindergartenActivity(
  progress: readonly SkillProgressRecord[],
  evidence: readonly SkillEvidenceEvent[],
  recentActivityIds: readonly string[],
  seed: number,
): ActivitySelection {
  return selectLessonActivity(kindergartenElaCatalog, progress, evidence, recentActivityIds, seed);
}

export function evaluateKindergartenActivity(
  activity: LearningActivityDefinition,
  answer: unknown,
  supports: readonly SupportLevel[],
): EvaluationResult {
  return evaluateLessonActivity(activity, answer, supports);
}

export class KindergartenLiteracyEngine extends LessonActivityEngine {
  constructor(repository: ProgressRepository, now: () => Date = () => new Date()) {
    super(kindergartenElaCatalog, repository, now);
  }
}
