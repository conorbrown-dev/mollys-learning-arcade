import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { evaluateAnswer } from "../domain/answer-evaluator";
import type { AttemptEvent, DiagnosticPlacement, LearningSessionRecord } from "../domain/progress";
import type { ProgressRepository } from "../domain/progress.repository";
import type { QuestionInstance, QuestionTemplate } from "../domain/question-template";
import { PrismaProgressRepository } from "../infrastructure/prisma-progress.repository";
import { catalogTemplateToQuestionTemplate } from "../infrastructure/k2-review-packet";
import { loadK2ContentCatalog, validateK2ContentCatalog } from "../infrastructure/k2-content-catalog";
import { loadProductionLessonPlans } from "../infrastructure/lesson-plan-catalog";
import { selectNextLearningTemplates } from "./curriculum-sequence";
import {
  advanceDiagnostic,
  buildDiagnosticReport,
  createDiagnosticBlueprint,
  createGradeDiagnosticBlueprint,
  diagnosticSessionLength,
  evidenceForSkill,
  markDiagnosticSkillUnavailable,
  recordDiagnosticProbe,
  selectNextDiagnosticSkill,
  startDiagnostic,
  type DiagnosticReport,
  type DiagnosticState
} from "./diagnostic-assessment";
import { diagnosticQuestionFingerprint } from "./diagnostic-question-fingerprint";
import { ProgressService } from "./progress-service";
import { generateQuestion } from "./question-generator";
import { LessonActivityEngine, activityByCheckpoint, activityView, evaluateLessonActivity, type LessonActivityCheckpoint } from "./lesson-activity-engine";
import { LESSON_CATALOGS, KINDERGARTEN_ELA_CATALOG_ID, lessonCatalogById, lessonCatalogFor, lessonCatalogSkill } from "../infrastructure/lesson-catalogs";
import type { LessonCatalog } from "../domain/lesson-catalog";
import type { MisconceptionTag, SupportLevel } from "../domain/learning-activity";
import type { EvidenceMode, SkillProgressState } from "../domain/ela-skill";

type SessionPurpose = "practice" | "review" | "diagnostic" | "placement" | "gradeReview" | "proctored" | "adultScored";
type LearningSubject = "ELA" | "MATH" | "SCIENCE" | "SOCIAL_STUDIES" | "HEALTH" | "PHYSICAL_EDUCATION" | "FINE_ARTS" | "COMPUTER_SCIENCE" | "INFORMATION_LITERACY";
type StoredSession = {
  id: string; learnerId: string; purpose: SessionPurpose; grade: string; diagnosticGrouping: string; seed: number; position: number; length: number;
  templates: QuestionTemplate[]; instance: QuestionInstance; submittedInstanceIds: Set<string>; diagnosticQuestionFingerprints: Set<string>; proctoredCorrect: number;
  assessmentResult?: DiagnosticPlacement; retryTemplateId?: string; diagnostic?: DiagnosticState; createdAt: Date; status: "active" | "completed";
  lesson?: LessonActivityCheckpoint;
};
type PersistedSessionState = {
  grade: string; diagnosticGrouping: string; templateIds: string[]; instance: QuestionInstance; submittedInstanceIds: string[]; diagnosticQuestionFingerprints?: string[]; proctoredCorrect: number;
  assessmentResult?: Omit<DiagnosticPlacement, "completedAt"> & { completedAt: string }; retryTemplateId?: string; diagnostic?: DiagnosticState;
  lesson?: LessonActivityCheckpoint;
  /** Sessions saved before lessons covered more than Kindergarten. */
  kindergarten?: LessonActivityCheckpoint;
};
type LessonSubmissionResponse = {
  correct: boolean;
  explanation: string;
  masteryState: SkillProgressState;
  complete: boolean;
  retry: false;
  celebrate: boolean;
  evidenceMode: EvidenceMode;
  misconception: MisconceptionTag;
  tutorState: "ENCOURAGING" | "GENTLE_CORRECTION" | "CELEBRATING";
  tutorMessage: string;
  placement: undefined;
};

export const CURRICULUM_PROCTOR_CODE = Symbol("CURRICULUM_PROCTOR_CODE");
export const KINDERGARTEN_ELA_ENABLED = Symbol("KINDERGARTEN_ELA_ENABLED");
export const KINDERGARTEN_ELA_AUDIO_READY = Symbol("KINDERGARTEN_ELA_AUDIO_READY");
const seedAt = (seed: number, position: number) => Math.abs(Math.imul(seed ^ (position + 1), 2654435761)) >>> 0;
const subjectName = (subject: LearningSubject | undefined) => subject === "ELA" ? "Reading & Language" : subject === "MATH" ? "Math" : subject?.split("_").map((word) => `${word[0]}${word.slice(1).toLowerCase()}`).join(" ") ?? "Learning";
const catalogSubject = (subject: LearningSubject | undefined) => subject === "SOCIAL_STUDIES" ? "socialStudies" : subject === "PHYSICAL_EDUCATION" ? "physicalEducation" : subject === "FINE_ARTS" ? "fineArts" : subject === "COMPUTER_SCIENCE" ? "computerScience" : subject === "INFORMATION_LITERACY" ? "informationLiteracy" : subject?.toLowerCase();
const isAdaptiveAssessment = (purpose: SessionPurpose) => purpose === "diagnostic" || purpose === "placement" || purpose === "gradeReview";
/** The current-grade check and the manual grade review stay inside one grade; only placement climbs across grades. */
const isSingleGradeAssessment = (purpose: SessionPurpose) => purpose === "diagnostic" || purpose === "gradeReview";
const requiresAdultCode = (purpose: SessionPurpose) => purpose === "proctored" || purpose === "adultScored" || purpose === "placement" || purpose === "gradeReview";
const catalogStandardsForSkill = (skillId: string) => lessonCatalogSkill(skillId).standardMappings.map((mapping) => mapping.standardId);

@Injectable()
export class LearningFacadeService {
  private readonly sessions = new Map<string, StoredSession>();
  private readonly progress: ProgressService;
  private readonly lessonEngines: Map<string, LessonActivityEngine>;
  private readonly lessonSubmissions = new Map<string, Promise<LessonSubmissionResponse>>();

  constructor(
    @Inject(PrismaProgressRepository) private readonly repository: ProgressRepository,
    @Inject(CURRICULUM_PROCTOR_CODE) private readonly proctorCode: string | undefined = process.env.CURRICULUM_PROCTOR_CODE,
    @Inject(KINDERGARTEN_ELA_ENABLED) private readonly kindergartenElaEnabled = false,
    @Inject(KINDERGARTEN_ELA_AUDIO_READY) private readonly kindergartenElaAudioReady = false,
  ) {
    this.progress = new ProgressService(repository, { now: () => new Date() });
    this.lessonEngines = new Map(LESSON_CATALOGS.map((catalog) => [catalog.id, new LessonActivityEngine(catalog, repository)]));
  }

  /**
   * The in-app lesson catalog to run for a practice session, if any.
   *
   * The Kindergarten slice stays behind its flag and its phoneme-audio gate.
   * Grade 1 narrates everything through the TTS service, so it carries no
   * recorded-audio dependency and is served by default.
   */
  private practiceLessonCatalog(grade: string, subject: LearningSubject | undefined): LessonCatalog | undefined {
    const catalog = lessonCatalogFor(grade, subject);
    if (!catalog) return undefined;
    if (catalog.id !== KINDERGARTEN_ELA_CATALOG_ID) return catalog;
    return this.kindergartenElaEnabled ? catalog : undefined;
  }

  private engineFor(catalogId: string | undefined): LessonActivityEngine {
    const engine = this.lessonEngines.get(lessonCatalogById(catalogId).id);
    if (!engine) throw new Error("This lesson catalog is not available.");
    return engine;
  }

  async start(learnerId: string, purpose: SessionPurpose, seed = Math.floor(Math.random() * 2_147_483_647), submittedProctorCode?: string, grade = "K", subject?: LearningSubject) {
    if (requiresAdultCode(purpose) && (!this.proctorCode || submittedProctorCode !== this.proctorCode)) throw new ForbiddenException("A parent or teacher verification code is required to start a proctored assessment.");
    if (isAdaptiveAssessment(purpose) && subject !== "ELA" && subject !== "MATH") throw new ForbiddenException("Choose Reading & Language or Math before starting a diagnostic, placement check, or grade review.");
    const lessonCatalog = purpose === "practice" ? this.practiceLessonCatalog(grade, subject) : undefined;
    if (lessonCatalog) return this.startLessonSession(learnerId, seed, lessonCatalog);
    await validateK2ContentCatalog();
    const allTemplates = (await loadK2ContentCatalog()).templates.map(catalogTemplateToQuestionTemplate);
    const subjectFilter = catalogSubject(subject);
    const approved = allTemplates.filter((template) => template.review.status === "reviewed" && (!subjectFilter || template.subject === subjectFilter));
    const templates = approved.filter((template) => template.grade === grade && (purpose === "adultScored" ? template.generator.kind.endsWith("Adult") : !template.generator.kind.endsWith("Adult")));
    const diagnosticTemplates = isAdaptiveAssessment(purpose)
      ? approved.filter((template) => template.diagnosticEligible && !template.generator.kind.endsWith("Adult") && (!isSingleGradeAssessment(purpose) || template.grade === grade))
      : [];
    const availableTemplates = isAdaptiveAssessment(purpose) ? diagnosticTemplates : templates;
    if (!availableTemplates.length) throw new Error(`No approved ${subject ?? ""} Grade ${grade === "K" ? "Kindergarten" : grade} content is available.`);
    await this.progress.markDue(learnerId);
    const mastery = await this.repository.listMastery(learnerId);
    const activeTemplates = isAdaptiveAssessment(purpose) ? availableTemplates : purpose === "practice" ? selectNextLearningTemplates(templates, mastery) : purpose === "adultScored" ? selectNextLearningTemplates(templates, mastery, 1) : templates;
    if (!activeTemplates.length) throw new Error("All skills are mastered for now. Return when a scheduled review is due.");
    const diagnostic = isAdaptiveAssessment(purpose) ? startDiagnostic(isSingleGradeAssessment(purpose)
      ? createGradeDiagnosticBlueprint(activeTemplates, subject as "ELA" | "MATH", subjectName(subject), grade)
      : createDiagnosticBlueprint(activeTemplates, subject as "ELA" | "MATH", subjectName(subject), seed)) : undefined;
    const selected = diagnostic ? this.requireDiagnosticTemplate(diagnostic, activeTemplates) : activeTemplates[seedAt(seed, 0) % activeTemplates.length];
    const sessionPurpose: SessionPurpose = purpose === "practice" && mastery.some((record) => record.standardId === selected.primaryStandardId && record.state === "reviewDue") ? "review" : purpose;
    const sessionTemplates = purpose === "proctored" ? templates.filter((template) => template.primaryStandardId === selected.primaryStandardId) : activeTemplates;
    const now = new Date();
    const instance = generateQuestion(selected, seedAt(seed, 0));
    const session: StoredSession = {
      id: randomUUID(), learnerId, purpose: sessionPurpose, grade: selected.grade, diagnosticGrouping: subjectName(subject), seed, position: 0,
      length: diagnostic ? diagnosticSessionLength(diagnostic) : purpose === "adultScored" ? 1 : purpose === "proctored" ? 5 : 10,
      templates: sessionTemplates, instance, submittedInstanceIds: new Set<string>(), diagnosticQuestionFingerprints: new Set(diagnostic ? [diagnosticQuestionFingerprint(instance)] : []), proctoredCorrect: 0,
      diagnostic, createdAt: now, status: "active"
    };
    this.sessions.set(session.id, session);
    await this.checkpoint(session);
    return this.view(session);
  }

  private async startLessonSession(learnerId: string, seed: number, catalog: LessonCatalog) {
    if (catalog.id === KINDERGARTEN_ELA_CATALOG_ID && !this.kindergartenElaAudioReady) throw new ForbiddenException("The Kindergarten reading slice is awaiting qualified phoneme-audio review.");
    await catalog.validate();
    const selection = await this.engineFor(catalog.id).select(learnerId, [], seedAt(seed, 0));
    const instanceId = randomUUID();
    const lesson: LessonActivityCheckpoint = {
      catalogId: catalog.id,
      activityId: selection.activity.id,
      activityVersion: selection.activity.version,
      instanceId,
      selectionReason: selection.selectionReason,
      supportLevels: [],
      isRecorded: false,
      recentActivityIds: [selection.activity.id],
    };
    const now = new Date();
    const session: StoredSession = {
      id: randomUUID(), learnerId, purpose: "practice", grade: catalog.grade, diagnosticGrouping: subjectName(catalog.subject), seed, position: 0, length: catalog.sessionActivityLimit,
      templates: [], instance: this.questionForLesson(lesson), submittedInstanceIds: new Set<string>(), diagnosticQuestionFingerprints: new Set<string>(),
      proctoredCorrect: 0, createdAt: now, status: "active", lesson,
    };
    this.sessions.set(session.id, session);
    await this.checkpoint(session);
    return this.view(session);
  }

  private questionForLesson(checkpoint: LessonActivityCheckpoint): QuestionInstance {
    const activity = activityByCheckpoint(checkpoint);
    const skill = activityView(checkpoint).primarySkill;
    const standardIds = catalogStandardsForSkill(activity.primarySkillId);
    const interaction = activity.presentation.kind === "CHOICE_BOARD" || activity.presentation.kind === "CONTROLLED_TEXT"
      ? { choices: activity.presentation.choices.map((choice) => ({ id: choice.id, label: choice.label })) }
      : activity.presentation.kind === "CARD_WORKSPACE"
        ? { items: [...activity.presentation.cards] }
        : {};
    const responseType = activity.presentation.kind === "CARD_WORKSPACE" ? "sequence" : "singleChoice";
    return {
      schemaVersion: 1,
      id: checkpoint.instanceId,
      templateId: activity.id,
      templateVersion: activity.version,
      seed: checkpoint.instanceId,
      standardIds,
      responseType,
      prompt: { text: activity.prompt, audioText: activity.narration, instructions: activityView(checkpoint).tutor.message },
      interaction,
      canonicalAnswer: activity.canonicalAnswer,
      answerNormalization: null,
      explanation: activity.explanation,
      accessibility: { spokenPrompt: activity.narration, textAlternative: `${skill.name}. ${activity.prompt}`, reducedMotionSafe: true },
      provenance: { origin: "original", curriculum: lessonCatalogById(checkpoint.catalogId).id, activityId: activity.id, skillId: activity.primarySkillId },
    };
  }

  async submit(sessionId: string, answer: unknown, usedHint = false) {
    const session = await this.requireSession(sessionId);
    if (session.lesson) return this.submitLesson(session, answer, usedHint);
    const evaluation = evaluateAnswer(session.instance, answer);
    if (session.submittedInstanceIds.has(session.instance.id)) return { correct: evaluation.correct, explanation: session.instance.explanation, masteryState: "unchanged", complete: session.status === "completed", placement: this.placementView(session.assessmentResult) };
    const attempt: AttemptEvent = {
      id: randomUUID(), learnerId: session.learnerId, sessionId, questionInstanceId: session.instance.id, templateId: session.instance.templateId,
      templateVersion: session.instance.templateVersion, primaryStandardId: session.instance.standardIds[0], supportingStandardIds: session.instance.standardIds.slice(1),
      submittedAnswer: answer, correct: evaluation.correct, usedHint, independent: !evaluation.requiresHumanReview, purpose: session.purpose,
      deliveryContext: "standaloneLearning", responseDurationMs: null, attemptedAt: new Date(), responseType: session.instance.responseType
    };
    session.submittedInstanceIds.add(session.instance.id);
    const retry = !evaluation.correct && (session.purpose === "practice" || session.purpose === "review");
    if (retry) session.retryTemplateId = session.instance.templateId;
    const mastery = await this.progress.recordAttempt(attempt);
    if (session.diagnostic) {
      const currentGrade = session.diagnostic.blueprint.grades[session.diagnostic.gradeIndex];
      const currentSkill = currentGrade.domains.flatMap((domain) => domain.skills).find((skill) => skill.standardId === attempt.primaryStandardId);
      if (!currentSkill) throw new Error(`The diagnostic blueprint does not contain ${attempt.primaryStandardId}.`);
      session.diagnostic = recordDiagnosticProbe(session.diagnostic, {
        standardId: attempt.primaryStandardId, grade: session.grade, domain: currentSkill.domain, templateId: attempt.templateId,
        questionInstanceId: attempt.questionInstanceId, difficultyBand: session.templates.find((template) => template.id === attempt.templateId)?.difficulty.band ?? 1,
        correct: evaluation.correct, independent: attempt.independent
      });
      session.diagnostic = advanceDiagnostic(session.diagnostic);
      if (session.diagnostic.isComplete) await this.completeDiagnostic(session);
      await this.checkpoint(session);
      return { correct: evaluation.correct, explanation: session.instance.explanation, masteryState: mastery.state, complete: session.status === "completed", placement: this.placementView(session.assessmentResult) };
    }
    if (session.purpose === "proctored" && evaluation.correct) session.proctoredCorrect += 1;
    const complete = session.position + 1 >= session.length;
    const finalMastery = complete && session.purpose === "proctored" && session.proctoredCorrect >= 4 ? await this.progress.verifyProctoredMastery(session.learnerId, attempt.primaryStandardId) : mastery;
    if (complete) session.status = "completed";
    await this.checkpoint(session);
    return { correct: evaluation.correct, explanation: session.instance.explanation, masteryState: finalMastery.state, complete, retry, placement: this.placementView(session.assessmentResult) };
  }

  private async submitLesson(session: StoredSession, answer: unknown, usedHint: boolean): Promise<LessonSubmissionResponse> {
    const instanceId = session.lesson!.instanceId;
    const submissionKey = `${session.id}:${instanceId}`;
    const pending = this.lessonSubmissions.get(submissionKey);
    if (pending) return pending;
    const submission = this.recordLessonSubmission(session, answer, usedHint);
    this.lessonSubmissions.set(submissionKey, submission);
    try {
      return await submission;
    } catch (error) {
      if (session.lesson?.instanceId === instanceId && !session.lesson.recordedResult) {
        session.lesson.isRecorded = false;
        session.submittedInstanceIds.delete(session.lesson.instanceId);
      }
      throw error;
    } finally {
      this.lessonSubmissions.delete(submissionKey);
    }
  }

  private async recordLessonSubmission(session: StoredSession, answer: unknown, usedHint: boolean): Promise<LessonSubmissionResponse> {
    const checkpoint = session.lesson!;
    const catalog = lessonCatalogById(checkpoint.catalogId);
    const activity = activityByCheckpoint(checkpoint);
    if (activity.purpose === "INSTRUCTION" || activity.purpose === "MODELED_EXAMPLE") throw new Error("Complete this teaching step before continuing.");
    if (checkpoint.isRecorded || session.submittedInstanceIds.has(checkpoint.instanceId)) {
      const recorded = checkpoint.recordedResult;
      if (!recorded) throw new Error("This lesson response was already saved without a display result. Start a fresh activity.");
      return { correct: recorded.correct, explanation: recorded.explanation, masteryState: recorded.masteryState, complete: recorded.complete, retry: recorded.retry, celebrate: recorded.celebrate, evidenceMode: recorded.evidenceMode, misconception: recorded.misconception, tutorState: recorded.tutorState, tutorMessage: recorded.tutorMessage, placement: undefined };
    }
    if (usedHint && checkpoint.supportLevels.length === 0) checkpoint.supportLevels.push("L1_FOCUS");
    const proposedEvaluation = evaluateLessonActivity(activity, answer, checkpoint.supportLevels);
    checkpoint.isRecorded = true;
    session.submittedInstanceIds.add(checkpoint.instanceId);
    const record = await this.engineFor(checkpoint.catalogId).record(session.learnerId, session.id, checkpoint, proposedEvaluation.correct, answer, proposedEvaluation.evidenceMode);
    const acceptedSupports = record.evidence.supportEvents;
    checkpoint.supportLevels = [...acceptedSupports];
    const evaluation = record.isNew ? proposedEvaluation : evaluateLessonActivity(activity, record.evidence.response, acceptedSupports);
    const attemptPurpose: AttemptEvent["purpose"] = activity.purpose === "REVIEW" ? "review" : activity.purpose === "GUIDED_PRACTICE" ? "learning" : "practice";
    const standardIds = catalogStandardsForSkill(activity.primarySkillId);
    const attempt: AttemptEvent = {
      id: randomUUID(), learnerId: session.learnerId, sessionId: session.id, questionInstanceId: checkpoint.instanceId, templateId: activity.id,
      templateVersion: activity.version, primaryStandardId: standardIds[0], supportingStandardIds: standardIds.slice(1), submittedAnswer: record.evidence.response,
      correct: evaluation.correct, usedHint: acceptedSupports.some((support) => support !== "L0_REPLAY"), independent: (activity.purpose === "INDEPENDENT_PRACTICE" || activity.purpose === "MASTERY_CHECK" || activity.purpose === "REVIEW") && acceptedSupports.every((support) => support === "L0_REPLAY"),
      purpose: attemptPurpose, deliveryContext: `${catalog.deliveryContext}:${evaluation.evidenceMode}`, responseDurationMs: null, attemptedAt: new Date(), responseType: session.instance.responseType,
      activityId: activity.id, activityVersion: activity.version, primarySkillId: activity.primarySkillId, supportingSkillIds: [...activity.supportingSkillIds], evidenceMode: evaluation.evidenceMode, supportEvents: [...acceptedSupports],
    };
    await this.repository.addAttempt(attempt);
    const complete = session.position + 1 >= session.length;
    if (complete) session.status = "completed";
    checkpoint.recordedResult = { ...evaluation, masteryState: record.progress.state, complete, retry: false };
    await this.checkpoint(session);
    return { correct: evaluation.correct, explanation: evaluation.explanation, masteryState: record.progress.state, complete, retry: false, celebrate: evaluation.celebrate, evidenceMode: evaluation.evidenceMode, misconception: evaluation.misconception, tutorState: evaluation.tutorState, tutorMessage: evaluation.tutorMessage, placement: undefined };
  }

  async completeActivityForLearner(sessionId: string, learnerId: string, instanceId: string) {
    const session = await this.requireOwnedSession(sessionId, learnerId);
    if (!session.lesson || session.lesson.instanceId !== instanceId) throw new Error("This lesson step is no longer current.");
    const activity = activityByCheckpoint(session.lesson);
    if (activity.purpose !== "INSTRUCTION" && activity.purpose !== "MODELED_EXAMPLE") throw new Error("Submit a response for this activity.");
    if (!session.lesson.isRecorded) {
      session.lesson.isRecorded = true;
      session.submittedInstanceIds.add(instanceId);
      await this.engineFor(session.lesson.catalogId).record(session.learnerId, session.id, session.lesson, true, { completed: true });
    }
    const complete = session.position + 1 >= session.length;
    if (complete) session.status = "completed";
    await this.checkpoint(session);
    return { complete };
  }

  async hintForLearner(sessionId: string, learnerId: string, instanceId: string, requested?: SupportLevel) {
    const session = await this.requireOwnedSession(sessionId, learnerId);
    if (!session.lesson || session.lesson.instanceId !== instanceId || session.lesson.isRecorded) throw new Error("This lesson step is no longer available for a hint.");
    const result = this.engineFor(session.lesson.catalogId).addHint(session.lesson, requested);
    session.lesson = result.checkpoint;
    await this.checkpoint(session);
    const view = activityView(session.lesson);
    return { message: result.message, ...(result.narration ? { narration: result.narration } : {}), highestSupport: view.highestSupport, evidenceMode: view.evidenceMode };
  }

  async scoreAdult(sessionId: string, demonstrated: boolean, evidenceNote?: string) {
    const session = await this.requireSession(sessionId);
    if (session.purpose !== "adultScored") throw new ForbiddenException("This activity requires automatic scoring.");
    if (session.submittedInstanceIds.has(session.instance.id)) return { correct: demonstrated, explanation: session.instance.explanation, masteryState: "unchanged", complete: true };
    const adultEvidence = evidenceNote?.trim().slice(0, 1000);
    const attempt: AttemptEvent = {
      id: randomUUID(), learnerId: session.learnerId, sessionId, questionInstanceId: session.instance.id, templateId: session.instance.templateId,
      templateVersion: session.instance.templateVersion, primaryStandardId: session.instance.standardIds[0], supportingStandardIds: session.instance.standardIds.slice(1),
      submittedAnswer: { adultScore: demonstrated ? "demonstrated" : "notYet", ...(adultEvidence ? { adultEvidence } : {}) }, correct: demonstrated,
      usedHint: false, independent: false, purpose: "adultScored", deliveryContext: "adultProctored", responseDurationMs: null,
      attemptedAt: new Date(), responseType: session.instance.responseType
    };
    session.submittedInstanceIds.add(session.instance.id);
    const recorded = await this.progress.recordAttempt(attempt);
    const successfulObservations = (await this.repository.listAttempts(session.learnerId, attempt.primaryStandardId)).filter((item) => item.purpose === "adultScored" && item.correct).length;
    const hasEnoughObservations = demonstrated && successfulObservations >= 2;
    const mastery = hasEnoughObservations ? await this.progress.verifyProctoredMastery(session.learnerId, attempt.primaryStandardId) : recorded;
    session.status = "completed";
    await this.checkpoint(session);
    return {
      correct: demonstrated,
      explanation: !demonstrated ? "Keep practicing this skill with an adult." : hasEnoughObservations ? "The adult confirmed this skill twice. It is ready for review later." : "The adult recorded one successful observation. Complete it successfully with an adult once more to confirm the skill.",
      masteryState: hasEnoughObservations ? mastery.state : demonstrated ? "observedOnce" : mastery.state,
      complete: true
    };
  }

  async next(sessionId: string) {
    const session = await this.requireSession(sessionId);
    if (session.status === "completed") return null;
    if (session.lesson) return this.nextLesson(session);
    if (session.diagnostic) {
      while (!session.diagnostic.isComplete) {
        const skill = selectNextDiagnosticSkill(session.diagnostic);
        if (!skill) {
          session.diagnostic = advanceDiagnostic(session.diagnostic);
          continue;
        }
        const previousGrade = session.grade;
        const question = this.generateUniqueDiagnosticQuestion(session, skill.templateIds);
        if (!question) {
          session.diagnostic = markDiagnosticSkillUnavailable(session.diagnostic, skill.standardId);
          continue;
        }
        session.grade = session.templates.find((template) => template.id === question.templateId)?.grade ?? previousGrade;
        session.position = previousGrade === session.grade ? session.position + 1 : 0;
        session.length = diagnosticSessionLength(session.diagnostic);
        session.instance = question;
        session.diagnosticQuestionFingerprints.add(diagnosticQuestionFingerprint(question));
        await this.checkpoint(session);
        return this.view(session);
      }
      await this.completeDiagnostic(session);
      await this.checkpoint(session);
      return null;
    }
    if (session.position + 1 >= session.length) return null;
    session.position += 1;
    const retryTemplate = session.retryTemplateId ? session.templates.find((template) => template.id === session.retryTemplateId) : undefined;
    session.retryTemplateId = undefined;
    const candidates = retryTemplate ? [retryTemplate] : session.templates.filter((template) => template.id !== session.instance.templateId);
    const template = candidates[seedAt(session.seed, session.position) % candidates.length] ?? session.templates[0];
    session.grade = template.grade;
    session.instance = generateQuestion(template, seedAt(session.seed, session.position));
    await this.checkpoint(session);
    return this.view(session);
  }

  private async nextLesson(session: StoredSession) {
    if (!session.lesson?.isRecorded) throw new Error("Finish the current lesson step before continuing.");
    const catalog = lessonCatalogById(session.lesson.catalogId);
    if (session.position + 1 >= session.length) {
      session.status = "completed";
      await this.checkpoint(session);
      return null;
    }
    session.position += 1;
    const recentActivityIds = session.lesson.recentActivityIds;
    const selection = await this.engineFor(session.lesson.catalogId).select(session.learnerId, recentActivityIds, seedAt(session.seed, session.position));
    const instanceId = randomUUID();
    session.lesson = {
      catalogId: catalog.id,
      activityId: selection.activity.id,
      activityVersion: selection.activity.version,
      instanceId,
      selectionReason: selection.selectionReason,
      supportLevels: [],
      isRecorded: false,
      recentActivityIds: [...recentActivityIds, selection.activity.id].slice(-catalog.activityExclusionWindow),
    };
    session.instance = this.questionForLesson(session.lesson);
    await this.checkpoint(session);
    return this.view(session);
  }

  async progressFor(learnerId: string) {
    const [attempts, mastery, placements, skillProgress] = await Promise.all([this.repository.listAttempts(learnerId), this.repository.listMastery(learnerId), this.repository.listDiagnosticPlacements(learnerId), this.repository.listSkillProgress(learnerId)]);
    const latestAssessment = attempts.filter((attempt) => attempt.purpose === "diagnostic" || attempt.purpose === "placement").sort((left, right) => right.attemptedAt.getTime() - left.attemptedAt.getTime())[0];
    const newestFirst = [...placements].sort((left, right) => right.completedAt.getTime() - left.completedAt.getTime());
    const isGradeReview = (placement: DiagnosticPlacement) => placement.report.assessmentKind === "gradeReview";
    const latestPlacement = newestFirst.find((placement) => !isGradeReview(placement));
    const latestReview = newestFirst.find(isGradeReview);
    return { attempts, mastery, skillProgress: skillProgress.map((record) => ({ ...record, skillName: lessonCatalogSkill(record.skillId).name, domain: lessonCatalogSkill(record.skillId).domain })), latestDiagnosticPlacement: latestPlacement ? this.placementView(latestPlacement) : null, latestGradeReview: latestReview ? this.placementView(latestReview) : null, latestAssessmentSessionId: latestAssessment?.sessionId ?? null };
  }

  async lessonPlans() { return loadProductionLessonPlans(); }
  async get(sessionId: string) { return this.view(await this.requireSession(sessionId)); }
  async submitForLearner(sessionId: string, learnerId: string, answer: unknown, usedHint = false) { await this.requireOwnedSession(sessionId, learnerId); return this.submit(sessionId, answer, usedHint); }
  async scoreAdultForLearner(sessionId: string, learnerId: string, demonstrated: boolean, evidenceNote?: string) { await this.requireOwnedSession(sessionId, learnerId); return this.scoreAdult(sessionId, demonstrated, evidenceNote); }
  async nextForLearner(sessionId: string, learnerId: string) { await this.requireOwnedSession(sessionId, learnerId); return this.next(sessionId); }
  async getForLearner(sessionId: string, learnerId: string) { const session = await this.requireOwnedSession(sessionId, learnerId); return this.view(session); }
  async pauseForLearner(sessionId: string, learnerId: string) { const session = await this.requireOwnedSession(sessionId, learnerId); await this.checkpoint(session); return this.view(session); }

  private requireDiagnosticTemplate(diagnostic: DiagnosticState, templates: QuestionTemplate[]): QuestionTemplate {
    const skill = selectNextDiagnosticSkill(diagnostic);
    if (!skill) throw new Error("The diagnostic has enough evidence for this stage.");
    const evidence = evidenceForSkill(diagnostic, skill, diagnostic.blueprint.grades[diagnostic.gradeIndex].grade);
    const unseenTemplateId = skill.templateIds.find((templateId) => !evidence.templateIds.includes(templateId));
    const templateId = unseenTemplateId ?? skill.templateIds[evidence.attemptCount % skill.templateIds.length];
    const template = templates.find((item) => item.id === templateId);
    if (!template) throw new Error(`Diagnostic template ${templateId} is unavailable.`);
    return template;
  }

  private generateUniqueDiagnosticQuestion(session: StoredSession, templateIds: string[]): QuestionInstance | null {
    const templates = templateIds.map((templateId) => session.templates.find((template) => template.id === templateId)).filter((template): template is QuestionTemplate => Boolean(template));
    for (let offset = 0; offset < 100; offset += 1) {
      for (const template of templates) {
        const question = generateQuestion(template, `${session.seed}:${session.diagnostic!.gradeIndex}:${session.diagnostic!.probes.length}:${template.id}:${offset}`);
        const fingerprint = diagnosticQuestionFingerprint(question);
        if (!session.submittedInstanceIds.has(question.id) && !session.diagnosticQuestionFingerprints.has(fingerprint)) return question;
      }
    }
    return null;
  }

  private async completeDiagnostic(session: StoredSession): Promise<void> {
    const report = buildDiagnosticReport(session.diagnostic!);
    const learningTargetIds = [...new Set([...report.needsReinforcement, ...report.criticalPrerequisiteGaps, ...report.unresolvedSkills])];
    const placement: DiagnosticPlacement = {
      learnerId: session.learnerId, grouping: report.grouping, grade: report.instructionalGrade, learningTargetIds,
      report: { ...report, assessmentKind: session.purpose } as unknown as Record<string, unknown>, completedAt: new Date()
    };
    // A grade review is a one-off look at earlier material. It lists the skills to revisit but never changes what the student practices.
    if (session.purpose !== "gradeReview") await Promise.all(learningTargetIds.map((standardId) => this.repository.saveLearningTarget({ learnerId: session.learnerId, standardId, active: true })));
    await this.repository.saveDiagnosticPlacement(placement);
    session.assessmentResult = placement;
    session.status = "completed";
  }

  private async requireSession(id: string): Promise<StoredSession> {
    const cached = this.sessions.get(id);
    if (cached) return cached;
    const record = await this.repository.findLearningSession(id);
    if (!record) throw new Error("Learning session is unavailable. Start a new session.");
    const state = record.state as unknown as PersistedSessionState;
    const allTemplates = (await loadK2ContentCatalog()).templates.map(catalogTemplateToQuestionTemplate);
    const templates = state.templateIds.map((templateId) => allTemplates.find((template) => template.id === templateId)).filter((template): template is QuestionTemplate => Boolean(template));
    const lesson = state.lesson ?? state.kindergarten;
    if (!lesson && templates.length !== state.templateIds.length) throw new Error("Some content used by this learning session is no longer available.");
    if (lesson) activityByCheckpoint(lesson);
    const session: StoredSession = {
      id: record.id, learnerId: record.learnerId, purpose: record.purpose as SessionPurpose, grade: state.grade,
      diagnosticGrouping: state.diagnosticGrouping, seed: record.seed, position: record.position, length: record.length,
      templates, instance: state.instance, submittedInstanceIds: new Set(state.submittedInstanceIds),
      diagnosticQuestionFingerprints: new Set(state.diagnosticQuestionFingerprints ?? (state.diagnostic ? [diagnosticQuestionFingerprint(state.instance)] : [])), proctoredCorrect: state.proctoredCorrect,
      assessmentResult: state.assessmentResult ? { ...state.assessmentResult, completedAt: new Date(state.assessmentResult.completedAt) } : undefined,
      retryTemplateId: state.retryTemplateId, diagnostic: state.diagnostic, lesson, createdAt: record.createdAt, status: record.status
    };
    this.sessions.set(id, session);
    return session;
  }

  private async requireOwnedSession(id: string, learnerId: string): Promise<StoredSession> {
    const session = await this.requireSession(id);
    if (session.learnerId !== learnerId) throw new ForbiddenException("This learning session belongs to another student.");
    return session;
  }

  private async checkpoint(session: StoredSession): Promise<void> {
    const persisted: PersistedSessionState = {
      grade: session.grade, diagnosticGrouping: session.diagnosticGrouping, templateIds: session.templates.map((template) => template.id), instance: session.instance,
      submittedInstanceIds: [...session.submittedInstanceIds], diagnosticQuestionFingerprints: [...session.diagnosticQuestionFingerprints], proctoredCorrect: session.proctoredCorrect,
      assessmentResult: session.assessmentResult ? { ...session.assessmentResult, completedAt: session.assessmentResult.completedAt.toISOString() } : undefined,
      retryTemplateId: session.retryTemplateId, diagnostic: session.diagnostic, lesson: session.lesson
    };
    const now = new Date();
    const record: LearningSessionRecord = {
      id: session.id, learnerId: session.learnerId, purpose: session.purpose, seed: session.seed, position: session.position, length: session.length,
      state: persisted as unknown as Record<string, unknown>, status: session.status, createdAt: session.createdAt, updatedAt: now,
      completedAt: session.status === "completed" ? session.assessmentResult?.completedAt ?? now : null
    };
    await this.repository.saveLearningSession(record);
  }

  private placementView(placement: DiagnosticPlacement | undefined) {
    if (!placement) return undefined;
    const report = placement.report as unknown as DiagnosticReport;
    return { ...report, grouping: placement.grouping, grade: placement.grade, learningTargetIds: placement.learningTargetIds };
  }

  private view(session: StoredSession) {
    const { canonicalAnswer: _answer, ...instance } = session.instance;
    return {
      sessionId: session.id, position: session.position, length: session.length,
      ...(session.diagnostic ? { assessmentStage: { grade: session.grade, number: session.diagnostic.gradeIndex + 1, total: session.diagnostic.blueprint.grades.length } } : {}),
      ...(session.lesson ? { activity: activityView(session.lesson) } : {}),
      question: instance
    };
  }
}
