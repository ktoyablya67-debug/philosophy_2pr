import type {
  ArgumentStep,
  BossStep,
  ChoiceStep,
  DuelStep,
  LearningMission,
  MissionStep,
  SeminarQuestion,
  TrapStep,
  World,
} from "../types";
import { missions, requiredTopics, seminarQuestions, worlds } from "../data/gameData";

export type CoverageRow = {
  topic: string;
  inRequiredTopics: boolean;
  inMissionTopics: boolean;
  inLessonOrCoveredTopics: boolean;
  hasStep: boolean;
  hasBoss: boolean;
  hasTrap: boolean;
  status: "OK" | "WARNING";
};

export type SeminarCoverageRow = {
  seminarQuestionId: string;
  question: string;
  missionIds: string[];
  hasMission: boolean;
  hasBoss: boolean;
  hasTrap: boolean;
  hasOralAnswer: boolean;
  hasInteractiveStep: boolean;
  status: "OK" | "WARNING";
};

const uniq = <T,>(items: T[]) => new Set(items).size === items.length;
const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const allMissionSteps = (items: LearningMission[]) => items.flatMap((mission) => mission.steps);

export function getCoverageRows(): CoverageRow[] {
  return requiredTopics.map((topic) => {
    const inMissionTopics = missions.some((mission) => mission.requiredTopics.includes(topic));
    const inLessonOrCoveredTopics = missions.some(
      (mission) =>
        mission.lesson.keyTerms.includes(topic) ||
        mission.steps.some((step) => step.coveredTopics.includes(topic)) ||
        mission.finalBossQuestion.coveredTopics.includes(topic),
    );
    const hasStep = missions.some((mission) => mission.steps.some((step) => step.coveredTopics.includes(topic)));
    const hasBoss = missions.some(
      (mission) =>
        mission.finalBossQuestion.coveredTopics.includes(topic) ||
        mission.steps.some((step) => step.type === "boss" && step.coveredTopics.includes(topic)),
    );
    const hasTrap = missions.some(
      (mission) =>
        mission.teacherTraps.some((trap) => trap.topic === topic || trap.correction.includes(topic)) ||
        mission.steps.some((step) => step.type === "trap" && step.coveredTopics.includes(topic)),
    );
    const status = inMissionTopics && inLessonOrCoveredTopics && hasStep && hasBoss && hasTrap ? "OK" : "WARNING";
    return { topic, inRequiredTopics: true, inMissionTopics, inLessonOrCoveredTopics, hasStep, hasBoss, hasTrap, status };
  });
}

export function getSeminarCoverageRows(
  questions: SeminarQuestion[] = seminarQuestions,
  dataMissions: LearningMission[] = missions,
): SeminarCoverageRow[] {
  return questions.map((question) => {
    const linkedMissions = dataMissions.filter((mission) => mission.seminarQuestionId === question.id);
    const steps = linkedMissions.flatMap((mission) => mission.steps);
    const hasMission = linkedMissions.length > 0;
    const hasBoss = linkedMissions.some((mission) => hasText(mission.finalBossQuestion.question)) || steps.some((step) => step.type === "boss");
    const hasTrap =
      linkedMissions.some((mission) => mission.teacherTraps.length > 0 || hasText(mission.finalBossQuestion.commonMistake)) ||
      steps.some((step) => step.type === "trap");
    const hasOralAnswer = linkedMissions.some((mission) => hasText(mission.oralAnswer.short) && hasText(mission.oralAnswer.expanded));
    const hasInteractiveStep = steps.some((step) => ["choice", "duel", "argument", "trap"].includes(step.type));
    const status = hasMission && hasBoss && hasTrap && hasOralAnswer && hasInteractiveStep ? "OK" : "WARNING";
    return {
      seminarQuestionId: question.id,
      question: question.title,
      missionIds: linkedMissions.map((mission) => mission.id),
      hasMission,
      hasBoss,
      hasTrap,
      hasOralAnswer,
      hasInteractiveStep,
      status,
    };
  });
}

function validateStep(step: MissionStep, errors: string[]) {
  if (!hasText(step.id)) errors.push("Step has empty id");
  if (!hasText(step.scene)) errors.push(`${step.id}: empty scene`);
  if (!hasText(step.topic)) errors.push(`${step.id}: empty topic`);
  if (step.type === "choice") validateChoice(step, errors);
  if (step.type === "duel") validateDuel(step, errors);
  if (step.type === "argument") validateArgument(step, errors);
  if (step.type === "trap") validateTrap(step, errors);
  if (step.type === "boss") validateBoss(step, errors);
}

function validateChoice(step: ChoiceStep, errors: string[]) {
  if (!hasText(step.question)) errors.push(`${step.id}: empty question`);
  if (!hasText(step.explanation)) errors.push(`${step.id}: empty explanation`);
  if (step.options.length !== 4) errors.push(`${step.id}: choice must have exactly 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex out of range`);
}

function validateDuel(step: DuelStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation)) errors.push(`${step.id}: empty question or explanation`);
  if (step.options.length !== 4) errors.push(`${step.id}: duel must have exactly 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex out of range`);
}

function validateTrap(step: TrapStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation) || !hasText(step.falseStatement)) errors.push(`${step.id}: incomplete trap step`);
  if (step.options.length !== 4) errors.push(`${step.id}: trap must have exactly 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex out of range`);
}

function validateArgument(step: ArgumentStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation)) errors.push(`${step.id}: empty question/explanation`);
  const validIndexes = step.correctOrder.every((index) => index >= 0 && index < step.fragments.length);
  if (!validIndexes || step.correctOrder.length !== step.fragments.length) errors.push(`${step.id}: invalid correctOrder`);
}

function validateBoss(step: BossStep, errors: string[]) {
  if (!hasText(step.question)) errors.push(`${step.id}: empty boss question`);
  if (!hasText(step.shortAnswer) || !hasText(step.expandedAnswer)) errors.push(`${step.id}: missing shortAnswer or expandedAnswer`);
}

export function validateData(dataWorlds: World[] = worlds, dataMissions: LearningMission[] = missions) {
  const errors: string[] = [];
  if (!requiredTopics.length) errors.push("CoverageCheck received empty requiredTopics");
  if (!uniq(dataWorlds.map((world) => world.id))) errors.push("Duplicate world.id values");
  if (!uniq(dataMissions.map((mission) => mission.id))) errors.push("Duplicate mission.id values");
  const stepIds = allMissionSteps(dataMissions).map((step) => step.id);
  if (!uniq(stepIds)) errors.push("Duplicate step.id values");

  const missionIds = new Set(dataMissions.map((mission) => mission.id));
  const worldIds = new Set(dataWorlds.map((world) => world.id));
  dataWorlds.forEach((world) => world.missionIds.forEach((id) => !missionIds.has(id) && errors.push(`${world.id}: missionId ${id} not found`)));

  dataMissions.forEach((mission) => {
    if (!worldIds.has(mission.worldId)) errors.push(`${mission.id}: worldId ${mission.worldId} not found`);
    if (!hasText(mission.seminarQuestionId)) errors.push(`${mission.id}: missing seminarQuestionId`);
    if (mission.seminarQuestionId !== "sq-final" && !seminarQuestions.some((question) => question.id === mission.seminarQuestionId)) {
      errors.push(`${mission.id}: seminarQuestionId ${mission.seminarQuestionId} not found`);
    }
    if (!["textbook_verified", "assignment_based", "needs_textbook_review"].includes(mission.sourceStatus)) {
      errors.push(`${mission.id}: invalid sourceStatus`);
    }
    if (!hasText(mission.sourceNote)) errors.push(`${mission.id}: missing sourceNote`);
    if (!mission.lesson || !hasText(mission.lesson.simpleExplanation) || !hasText(mission.lesson.textbookCore)) errors.push(`${mission.id}: incomplete lesson`);
    if (!hasText(mission.oralAnswer.short) || !hasText(mission.oralAnswer.expanded)) errors.push(`${mission.id}: incomplete oralAnswer`);
    mission.steps.forEach((step) => validateStep(step, errors));
    validateBoss(mission.finalBossQuestion, errors);
  });

  getSeminarCoverageRows(seminarQuestions, dataMissions).forEach((row) => {
    if (!row.hasMission) errors.push(`${row.seminarQuestionId}: no linked missions`);
    if (!row.hasBoss) errors.push(`${row.seminarQuestionId}: no boss question`);
    if (!row.hasTrap) errors.push(`${row.seminarQuestionId}: no trap/commonMistake`);
    if (!row.hasOralAnswer) errors.push(`${row.seminarQuestionId}: no oralAnswer`);
    if (!row.hasInteractiveStep) errors.push(`${row.seminarQuestionId}: no choice/duel/argument/trap step`);
  });

  return errors;
}
