import type {
  BossStep,
  LearningMission,
  MissionStep,
  MissionVisualBlock,
  NotebookTerm,
  SeminarId,
  SeminarQuestion,
  SourceStatus,
  World,
} from "../types";

export type SeminarMissionSpec = {
  id: string;
  seminarId: SeminarId;
  worldId: string;
  questionId: string;
  questionNumber: number;
  title: string;
  subtopic: string;
  prompt: string;
  topics: string[];
  notebookTermIds: string[];
  pages: string[];
  sections: string[];
  sourceStatus: SourceStatus;
  sourceNote: string;
  scene: string;
  definition: string;
  simple: string;
  context: string;
  distinction: string;
  example: string;
  importance: string;
  analogy: string;
  memoryHook: string;
  joke: string;
  trap: string;
  correction: string;
  visual: MissionVisualBlock;
  choiceQuestion: string;
  choiceCorrect: string;
  choiceDistractors: string[];
  duelLeft: string;
  duelRight: string;
  duelCorrect: string;
  duelDistractors: string[];
  skeleton: string[];
  teacherQuestions: string[];
  final?: boolean;
};

export function createQuestion(
  seminarId: SeminarId,
  number: number,
  id: string,
  title: string,
  wording: string,
  subpoints: string[],
  teacherMayAsk: string[],
  mustKnow: string[],
  textbookPages: string[],
  textbookSections: string[],
  source: SeminarQuestion["source"] = "assignment-sheet",
): SeminarQuestion {
  return {
    id,
    seminarId,
    number,
    title,
    source,
    wording,
    fullPrompt: wording,
    subpoints,
    teacherMayAsk,
    mustKnow,
    requiredKnowledge: mustKnow,
    textbookPages,
    textbookSections,
    missionIds: [],
  };
}

export function createNotebookTerm(
  seminarId: SeminarId,
  id: string,
  title: string,
  pages: string[],
  shortMeaning: string,
  sourceStatus: SourceStatus,
): NotebookTerm {
  return {
    id,
    seminarId,
    label: title,
    title,
    assignmentPages: pages,
    textbookPages: pages,
    shortMeaning,
    missionIds: [],
    sourceStatus,
  };
}

function wc(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function padLesson(spec: SeminarMissionSpec) {
  const base = `${spec.definition} ${spec.simple} ${spec.context} Отличие от близкой темы: ${spec.distinction} ${spec.example} ${spec.importance}`;
  const expanded = `${base} Важно видеть эту тему не как отдельное слово, а как узел философской проблемы: она показывает, что именно считается основанием знания, морали, общества или человеческого существования. Внутри семинара понятие работает вместе с соседними терминами: ${spec.topics.slice(0, 5).join(", ")}. Поэтому при изучении нужно удерживать связь определения, исторического контекста, типичной ошибки и примера. Тогда материал становится не набором фамилий, а понятной картой эпохи и вопроса. Дополнительно важно проговорить, чем это понятие отличается от похожего: такое сравнение защищает от типичной ошибки и показывает, что студент понимает внутреннюю логику темы, а не просто узнаёт термин. В устной проверке это помогает быстро перейти от определения к философскому смыслу. Ещё один слой понимания — увидеть, какую работу понятие выполняет в системе автора или главы: оно объясняет источник знания, устройство реальности, механизм общества, природу человека или нормы науки. Поэтому хороший учебный блок даёт не инструкцию по ответу, а материал для понимания с нуля: что обозначает термин, почему он возник, с чем его нельзя путать и какой пример показывает его смысл.`;
  const reinforced = `${expanded} Для закрепления смысла полезно проговорить причинную связь: из определения следует проблема, из проблемы следует различие, из различия становится понятной типичная ошибка. Такой ход делает тему устойчивой даже без заучивания больших абзацев.`;
  if (!spec.final || wc(reinforced) >= 500) return reinforced;
  return `${reinforced} Итоговый ответ собирает все подпункты вопроса в одну линию: сначала задаётся главное понятие, затем показывается исторический контекст, после этого раскрываются основные различия и типичные ошибки. Такой ответ не должен быть списком терминов. Он должен показать, как понятия связаны между собой и почему именно они образуют философскую позицию. Если студент удерживает эту связку, он может отвечать на уточняющие вопросы преподавателя: дать определение, привести пример, сравнить с соседней темой и объяснить, почему ловушка неверна. Поэтому итоговая миссия работает как короткая карта всего вопроса, а не как отдельный новый параграф. В финале важно связать все элементы вопроса: ключевых авторов, основные понятия, исторический фон, сравнения и учебные формулировки. Тогда ответ звучит как понимание материала, а не как чтение списка. Для полного ответа добавляется ещё один уровень: нужно показать, как отдельные микротемы поддерживают главный вопрос. Одна микротема даёт определение, другая раскрывает механизм, третья показывает отличие от похожего понятия, четвёртая предупреждает распространённую ошибку. Вместе они образуют ответ на две-три минуты, где каждая фраза нужна для смысла. Важно также показать внутреннюю последовательность: почему сначала появляется проблема, затем понятия, затем различия и только потом вывод. Такой порядок не является мета-инструкцией внутри урока, а отражает саму структуру материала: философская тема имеет основание, развитие, конфликт и итоговый смысл. Именно поэтому итоговый урок длиннее обычного: он соединяет все микрообъяснения в цельную предметную картину. В такой картине определения не висят отдельно: они объясняют друг друга и помогают отвечать на дополнительные вопросы без паники.`;
}

function lessonBlocks(spec: SeminarMissionSpec) {
  return [
    { title: "Что это?", text: spec.definition },
    { title: "Простыми словами", text: spec.simple },
    { title: "Контекст", text: spec.context },
    { title: "Чем отличается", text: spec.distinction },
    { title: "Пример", text: spec.example },
    { title: "Почему важно", text: spec.importance },
    { title: "Связка", text: `Тема держится на связи терминов: ${spec.topics.join(", ")}. Отличие и ловушка помогают не спутать её с соседними понятиями. Если удержать определение, контекст, пример и типичную ошибку, вопрос становится понятной философской схемой, а не набором слов. Этот блок нужен именно для понимания: он связывает термин с эпохой, автором и реальной проблемой. Поэтому карточка работает как мини-карта: что означает понятие, где его место и какую ошибку оно исправляет.` },
  ];
}

function stepBase(spec: SeminarMissionSpec, suffix: string) {
  return {
    id: `${spec.id}-${suffix}`,
    seminarId: spec.seminarId,
    topic: spec.subtopic,
    coveredTopics: spec.topics,
    scene: `Проверка понимания: ${spec.subtopic}.`,
  };
}

function bossStep(spec: SeminarMissionSpec, suffix: string, question = spec.prompt): BossStep {
  return {
    ...stepBase(spec, `boss-${suffix}`),
    type: "boss",
    question,
    hint: `Опирайся на связку: ${spec.skeleton.join(" -> ")}.`,
    shortAnswer: spec.skeleton.join(" "),
    expandedAnswer: `${spec.definition} ${spec.simple} ${spec.importance}`,
    commonMistake: spec.trap,
    followUpQuestion: spec.teacherQuestions[0] ?? spec.prompt,
  };
}

function steps(spec: SeminarMissionSpec): MissionStep[] {
  return [
    {
      ...stepBase(spec, "choice"),
      type: "choice",
      question: spec.choiceQuestion,
      options: [spec.choiceCorrect, ...spec.choiceDistractors],
      correctOptionIndex: 0,
      correctFeedback: "Верно: это различение удерживает смысл темы.",
      wrongFeedback: "Похоже на распространённую ошибку. Проверь определение и отличие от соседнего понятия.",
      explanation: spec.choiceCorrect,
    },
    {
      ...stepBase(spec, "duel"),
      type: "duel",
      leftLabel: spec.duelLeft,
      rightLabel: spec.duelRight,
      question: `Как точнее различить ${spec.duelLeft} и ${spec.duelRight}?`,
      options: [spec.duelCorrect, ...spec.duelDistractors],
      correctOptionIndex: 0,
      explanation: spec.duelCorrect,
    },
    {
      ...stepBase(spec, "trap"),
      type: "trap",
      falseStatement: spec.trap,
      question: "Почему это ловушка?",
      options: [
        spec.correction,
        "В формулировке не хватает только даты, а смысл верный.",
        "Достаточно заменить автора, философская проблема не меняется.",
        "Это удачная бытовая формулировка без потери смысла.",
      ],
      correctOptionIndex: 0,
      explanation: spec.correction,
    },
    {
      ...stepBase(spec, "argument"),
      type: "argument",
      question: `Собери ответ: ${spec.subtopic}.`,
      fragments: spec.skeleton,
      correctOrder: spec.skeleton.map((_, index) => index),
      finalOralAnswer: spec.skeleton.join(" "),
      explanation: "Такой порядок ведёт от понятия к проблеме, различению и философскому смыслу.",
    },
    bossStep(spec, "main"),
  ];
}

export function createMission(spec: SeminarMissionSpec): LearningMission {
  const lesson = padLesson(spec);
  const answer40sec = spec.skeleton.join(" ");
  const answer2min = `${spec.definition} ${spec.simple} ${spec.distinction} ${spec.importance}`;
  return {
    id: spec.id,
    seminarId: spec.seminarId,
    worldId: spec.worldId,
    seminarQuestionId: spec.questionId,
    assignmentQuestionId: spec.questionId,
    assignmentSubtopic: spec.subtopic,
    directAssignmentPrompt: spec.prompt,
    sourceStatus: spec.sourceStatus,
    sourceNote: spec.sourceNote,
    sourceRefs: {
      textbookPages: spec.pages,
      textbookSections: spec.sections,
      assignmentQuestionIds: [spec.questionId],
      notebookTermIds: spec.notebookTermIds,
    },
    title: spec.title,
    subtitle: spec.subtopic,
    requiredTopics: spec.topics,
    scene: spec.scene,
    introScene: `${spec.scene} Здесь сначала разбирается смысл понятия, затем оно закрепляется в заданиях.`,
    lesson: {
      simpleExplanation: lesson,
      textbookCore: `${spec.definition} ${spec.simple}`,
      whyItMatters: spec.importance,
      keyTerms: spec.topics,
      blocks: lessonBlocks(spec),
    },
    quickExplain: `${spec.subtopic}: ${spec.skeleton.slice(0, 2).join(" ")}`,
    analogy: spec.analogy,
    memoryHook: spec.memoryHook,
    miniJoke: spec.joke,
    keyTakeaways: spec.skeleton.slice(0, 6),
    visualType: spec.visual.type,
    visualData: spec.visual,
    knowledge: {
      definitions: [spec.definition, ...spec.topics.slice(0, 3).map((topic) => `${topic} — ключевой термин темы.`)],
      distinctions: [spec.distinction, spec.correction],
      examples: [spec.example, spec.choiceCorrect],
      names: spec.topics.filter((topic) => /[А-ЯA-Z]/.test(topic[0])),
      datesOrContext: [`Страницы: ${spec.pages.join(", ")}`, `Раздел: ${spec.sections.join(", ")}`],
      mustRemember: spec.skeleton,
    },
    answerStrategy: `Собери ответ через понятие, проблему, отличие и пример: ${spec.skeleton.join(" -> ")}.`,
    oralAnswer: {
      short: answer40sec,
      expanded: answer2min,
      answer40sec,
      answer2min,
      answerSkeleton: spec.skeleton,
      keyPhrases: spec.topics,
    },
    mustKnow: spec.skeleton,
    teacherQuestions: spec.teacherQuestions,
    teacherTraps: [{ id: `${spec.id}-teacher-trap`, falseStatement: spec.trap, correction: spec.correction, topic: spec.topics[0] }],
    steps: steps(spec),
    finalBossQuestion: bossStep(spec, "final", spec.teacherQuestions[0] ?? spec.prompt),
  };
}

export function createWorld(
  seminarId: SeminarId,
  id: string,
  title: string,
  subtitle: string,
  description: string,
  keyIdea: string,
  aesthetic: World["aesthetic"],
  missionIds: string[],
  fallbackGradient: string,
  pixelAccent: string,
): World {
  return {
    id,
    seminarId,
    title,
    subtitle,
    description,
    keyIdea,
    aesthetic,
    missionIds,
    visual: { imageAlt: title, moodKeywords: [title, subtitle], fallbackGradient, pixelAccent },
  };
}
