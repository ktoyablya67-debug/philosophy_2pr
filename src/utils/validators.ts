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
import { missions, requiredNotebookTerms, requiredTopics, seminarQuestions, worlds } from "../data/gameData";

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

export type NotebookCoverageRow = {
  notebookTermId: string;
  label: string;
  missionIds: string[];
  status: "OK" | "WARNING";
};

const uniq = <T,>(items: T[]) => new Set(items).size === items.length;
const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const allMissionSteps = (items: LearningMission[]) => items.flatMap((mission) => mission.steps);
const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

const forbiddenTemplatePhrases = [
  "тема относится к этапу",
  "важно не заучивать",
  "понятие, исторический контекст",
  "хороший ответ не ограничивается",
  "что считается главным",
  "бытовое правило",
  "современная научная теория",
  "набор случайных фактов",
  "что лучше всего передаёт смысл темы",
  "какая формулировка ближе к миссии",
];

const weakDistractors = [
  "оба ответа всегда совпадают",
  "различия не имеют значения",
  "можно оставить без исправлений, если произнести её уверенно",
  "заменить все философские термины бытовыми примерами",
];

const forbiddenLessonMetaPhrases = [
  "ответ нужно строить",
  "начинай с определения",
  "затем раскрой",
  "затем раскрываются",
  "в устном ответе",
  "используй термины",
  "объяснение должно звучать",
  "для закрепления произнеси",
  "преподаватель спрашивает не отдельное слово",
  "эта миссия нужна для вопроса",
  "листок требует",
  "источник verified by textbook",
  "извлечённый текст учебника поддерживает",
];

function fullMissionText(mission: LearningMission) {
  return [
    mission.title,
    mission.subtitle,
    mission.directAssignmentPrompt,
    mission.lesson.simpleExplanation,
    mission.lesson.textbookCore,
    mission.lesson.whyItMatters,
    mission.oralAnswer.short,
    mission.oralAnswer.expanded,
    mission.teacherQuestions.join(" "),
    mission.steps.map((step) => JSON.stringify(step)).join(" "),
    JSON.stringify(mission.finalBossQuestion),
  ].join(" ").toLowerCase();
}

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

export function getNotebookCoverageRows(dataMissions: LearningMission[] = missions): NotebookCoverageRow[] {
  return requiredNotebookTerms.map((term) => {
    const linked = dataMissions.filter((mission) => mission.sourceRefs.notebookTermIds.includes(term.id));
    return {
      notebookTermId: term.id,
      label: term.label,
      missionIds: linked.map((mission) => mission.id),
      status: linked.length > 0 || term.intentionallyStandalone ? "OK" : "WARNING",
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
  step.options.forEach((option) => {
    if (weakDistractors.some((phrase) => option.toLowerCase().includes(phrase))) errors.push(`${step.id}: weak placeholder distractor`);
  });
}

function validateDuel(step: DuelStep, errors: string[]) {
  if (!hasText(step.question) || !hasText(step.explanation)) errors.push(`${step.id}: empty question or explanation`);
  if (step.options.length !== 4) errors.push(`${step.id}: duel must have exactly 4 options`);
  if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) errors.push(`${step.id}: correctOptionIndex out of range`);
  step.options.forEach((option) => {
    if (weakDistractors.some((phrase) => option.toLowerCase().includes(phrase))) errors.push(`${step.id}: weak placeholder distractor`);
  });
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
    if (mission.seminarQuestionId !== "q-final" && !seminarQuestions.some((question) => question.id === mission.seminarQuestionId)) {
      errors.push(`${mission.id}: seminarQuestionId ${mission.seminarQuestionId} not found`);
    }
    if (!["textbook_verified", "assignment_based", "needs_textbook_review"].includes(mission.sourceStatus)) {
      errors.push(`${mission.id}: invalid sourceStatus`);
    }
    if (!hasText(mission.sourceNote)) errors.push(`${mission.id}: missing sourceNote`);
    if (!mission.sourceRefs) errors.push(`${mission.id}: missing sourceRefs`);
    if (mission.id !== "qfinal" && mission.sourceRefs && mission.sourceRefs.notebookTermIds.length === 0) {
      errors.push(`${mission.id}: no linked notebookTerm`);
    }
    if (mission.sourceStatus === "textbook_verified") {
      if (!mission.sourceRefs || mission.sourceRefs.textbookPages.length === 0) errors.push(`${mission.id}: textbook_verified without textbookPages`);
      if (!mission.sourceRefs || mission.sourceRefs.textbookSections.length === 0) errors.push(`${mission.id}: textbook_verified without textbookSections`);
    }
    if (!mission.lesson || !hasText(mission.lesson.simpleExplanation) || !hasText(mission.lesson.textbookCore)) errors.push(`${mission.id}: incomplete lesson`);
    if (!mission.knowledge || mission.knowledge.definitions.length < 2) errors.push(`${mission.id}: fewer than 2 knowledge definitions`);
    if (!hasText(mission.answerStrategy)) errors.push(`${mission.id}: missing answerStrategy`);
    const lessonText = `${mission.lesson.simpleExplanation} ${mission.lesson.textbookCore} ${mission.lesson.whyItMatters}`;
    if (mission.id !== "qfinal" && wordCount(lessonText) < 250) errors.push(`${mission.id}: lesson shorter than 250 words`);
    if (mission.id !== "qfinal" && mission.assignmentSubtopic.toLowerCase().includes("итоговый ответ") && wordCount(lessonText) < 500) {
      errors.push(`${mission.id}: final answer lesson shorter than 500 words`);
    }
    const promptTokens = `${mission.assignmentSubtopic} ${mission.requiredTopics.join(" ")}`
      .toLowerCase()
      .split(/[^а-яёa-z0-9]+/i)
      .filter((token) => token.length > 5);
    if (mission.id !== "qfinal" && promptTokens.length > 0 && !promptTokens.some((token) => lessonText.toLowerCase().includes(token))) {
      errors.push(`${mission.id}: lesson does not contain concrete terms from directAssignmentPrompt`);
    }
    forbiddenTemplatePhrases.forEach((phrase) => {
      if (fullMissionText(mission).includes(phrase)) errors.push(`${mission.id}: forbidden template phrase "${phrase}"`);
    });
    forbiddenLessonMetaPhrases.forEach((phrase) => {
      if (lessonText.toLowerCase().includes(phrase)) errors.push(`${mission.id}: meta phrase in lesson "${phrase}"`);
    });
    if (mission.id !== "qfinal" && !/отлич|различ|сравн|в отличие|не совпада/.test(lessonText.toLowerCase())) {
      errors.push(`${mission.id}: lesson lacks comparison or distinction`);
    }
    if (mission.id !== "qfinal" && !/эпох|средневек|возрожд|нового времени|просвещ|антич/.test(lessonText.toLowerCase())) {
      errors.push(`${mission.id}: lesson lacks epoch context`);
    }
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
  getNotebookCoverageRows(dataMissions).forEach((row) => {
    if (row.status !== "OK") errors.push(`${row.notebookTermId}: notebook term is not covered`);
  });

  seminarQuestions.forEach((question) => {
    const linked = dataMissions.filter((mission) => mission.seminarQuestionId === question.id);
    if (linked.length < 8) errors.push(`${question.id}: fewer than 8 micro-missions`);
    if (!linked.some((mission) => mission.assignmentSubtopic.toLowerCase().includes("итоговый ответ"))) {
      errors.push(`${question.id}: no final full-answer mission`);
    }
    const teacherQuestionsCount = linked.reduce((sum, mission) => sum + mission.teacherQuestions.length, 0);
    if (teacherQuestionsCount < 10) errors.push(`${question.id}: fewer than 10 teacherQuestions`);
    const bossCount = linked.reduce(
      (sum, mission) => sum + 1 + mission.steps.filter((step) => step.type === "boss").length,
      0,
    );
    if (bossCount < 8) errors.push(`${question.id}: fewer than 8 boss questions`);
    const trapCount = linked.reduce(
      (sum, mission) => sum + mission.teacherTraps.length + mission.steps.filter((step) => step.type === "trap").length,
      0,
    );
    if (trapCount < 8) errors.push(`${question.id}: fewer than 8 trap questions`);
  });

  return errors;
}
