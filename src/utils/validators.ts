import type { ArgumentStep, BossStep, ChoiceStep, DuelStep, LearningMission, MissionStep, TrapStep, World } from "../types";
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
    const status =
      requiredTopics.includes(topic) && inMissionTopics && inLessonOrCoveredTopics && hasStep && hasBoss && hasTrap
        ? "OK"
        : "WARNING";
    return { topic, inRequiredTopics: true, inMissionTopics, inLessonOrCoveredTopics, hasStep, hasBoss, hasTrap, status };
  });
}

function validateStep(step: MissionStep, errors: string[]) {
  if (!hasText(step.id)) errors.push("У шага пустой id");
  if (!hasText(step.scene)) errors.push(`${step.id}: пустая scene`);
  if (!hasText(step.topic)) errors.push(`${step.id}: пустой topic`);
  if (step.type === "choice") validateChoice(step, errors);
  if (step.type === "duel") validateDuel(step, errors);
  if (step.type === "argument") validateArgument(step, errors);
  if (step.type === "trap") validateTrap(step, errors);
  if (step.type === "boss") validateBoss(step, errors);
}

function validateChoice(step: ChoiceStep, errors: string[]) {
  if (!hasText(step.question)) errors.push(`${step.id}: пустой question`);
  if (!hasText(step.explanation)) errors.push(`${step.id}: пустое explanation`);
  if (step.options.length !== 4) errors.push(`${step.id}: у choice должно быть ровно 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex вне диапазона`);
}

function validateDuel(step: DuelStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation)) errors.push(`${step.id}: пустой вопрос или explanation`);
  if (step.options.length !== 4) errors.push(`${step.id}: у duel должно быть ровно 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex вне диапазона`);
}

function validateTrap(step: TrapStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation) || !hasText(step.falseStatement)) errors.push(`${step.id}: пустая trap-структура`);
  if (step.options.length !== 4) errors.push(`${step.id}: у trap должно быть ровно 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex вне диапазона`);
}

function validateArgument(step: ArgumentStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation)) errors.push(`${step.id}: пустой question/explanation`);
  const validIndexes = step.correctOrder.every((index) => index >= 0 && index < step.fragments.length);
  if (!validIndexes || step.correctOrder.length !== step.fragments.length) errors.push(`${step.id}: некорректный correctOrder`);
}

function validateBoss(step: BossStep, errors: string[]) {
  if (!hasText(step.question)) errors.push(`${step.id}: пустой boss question`);
  if (!hasText(step.shortAnswer) || !hasText(step.expandedAnswer)) errors.push(`${step.id}: у boss нет shortAnswer или expandedAnswer`);
}

export function validateData(dataWorlds: World[] = worlds, dataMissions: LearningMission[] = missions) {
  const errors: string[] = [];
  if (!requiredTopics.length) errors.push("CoverageCheck получил пустой список requiredTopics");
  if (!uniq(dataWorlds.map((world) => world.id))) errors.push("Есть дублирующиеся world.id");
  if (!uniq(dataMissions.map((mission) => mission.id))) errors.push("Есть дублирующиеся mission.id");
  const stepIds = allMissionSteps(dataMissions).map((step) => step.id);
  if (!uniq(stepIds)) errors.push("Есть дублирующиеся step.id");
  const missionIds = new Set(dataMissions.map((mission) => mission.id));
  const worldIds = new Set(dataWorlds.map((world) => world.id));
  dataWorlds.forEach((world) => world.missionIds.forEach((id) => !missionIds.has(id) && errors.push(`${world.id}: missionId ${id} не найден`)));
  dataMissions.forEach((mission) => {
    if (!worldIds.has(mission.worldId)) errors.push(`${mission.id}: worldId ${mission.worldId} не найден`);
    if (mission.seminarQuestionId !== "sq-final" && !seminarQuestions.some((question) => question.id === mission.seminarQuestionId)) {
      errors.push(`${mission.id}: seminarQuestionId ${mission.seminarQuestionId} не найден в листке задания`);
    }
    if (!mission.lesson || !hasText(mission.lesson.simpleExplanation) || !hasText(mission.lesson.textbookCore)) errors.push(`${mission.id}: неполный lesson`);
    if (!hasText(mission.oralAnswer.short) || !hasText(mission.oralAnswer.expanded)) errors.push(`${mission.id}: неполный oralAnswer`);
    mission.steps.forEach((step) => validateStep(step, errors));
    validateBoss(mission.finalBossQuestion, errors);
  });
  return errors;
}
