export type Aesthetic =
  | "medieval"
  | "scholastic"
  | "renaissance"
  | "newTime"
  | "enlightenment"
  | "seminar3"
  | "seminar7"
  | "finalBoss";

export type SeminarId = "seminar2" | "seminar3" | "seminar7";

export type Seminar = {
  id: SeminarId;
  title: string;
  subtitle: string;
  description: string;
  textbookRanges: string[];
  assignmentPath: string;
  questionIds: string[];
  notebookTermIds: string[];
  aesthetic: Aesthetic;
};

export type WorldVisual = {
  imageUrl?: string;
  imageAlt: string;
  moodKeywords: string[];
  fallbackGradient: string;
  pixelAccent: string;
};

export type World = {
  id: string;
  seminarId: SeminarId;
  title: string;
  subtitle: string;
  description: string;
  keyIdea: string;
  aesthetic: Aesthetic;
  missionIds: string[];
  visual: WorldVisual;
};

export type SeminarQuestion = {
  id: string;
  seminarId: SeminarId;
  number: number;
  title: string;
  source: "assignment-sheet" | "assignment-sheet-inferred" | "textbook-control-questions" | "textbook-control-questions-inferred";
  wording: string;
  fullPrompt?: string;
  subpoints: string[];
  teacherMayAsk: string[];
  mustKnow: string[];
  requiredKnowledge?: string[];
  textbookPages?: string[];
  textbookSections?: string[];
  missionIds: string[];
};

export type NotebookTerm = {
  id: string;
  seminarId: SeminarId;
  label: string;
  title?: string;
  assignmentPages: string[];
  textbookPages?: string[];
  shortMeaning: string;
  missionIds?: string[];
  sourceStatus?: SourceStatus;
  intentionallyStandalone?: boolean;
};

export type SourceStatus = "textbook_verified" | "assignment_based" | "needs_textbook_review";

export type SourceRefs = {
  textbookPages: string[];
  textbookSections: string[];
  assignmentQuestionIds: string[];
  notebookTermIds: string[];
};

export type MissionVisualBlock =
  | {
      type: "flow";
      title: string;
      items: string[];
    }
  | {
      type: "comparison";
      title: string;
      leftTitle: string;
      rightTitle: string;
      rows: { label: string; left: string; right: string }[];
    }
  | {
      type: "cards";
      title: string;
      cards: { title: string; text: string }[];
    };

export type LessonBlock = {
  title: string;
  text: string;
};

export type LearningMission = {
  id: string;
  seminarId: SeminarId;
  worldId: string;
  seminarQuestionId: string;
  assignmentQuestionId: string;
  assignmentSubtopic: string;
  directAssignmentPrompt: string;
  sourceStatus: SourceStatus;
  sourceNote: string;
  sourceRefs: SourceRefs;
  title: string;
  subtitle: string;
  requiredTopics: string[];
  scene: string;
  introScene: string;
  lesson: {
    simpleExplanation: string;
    textbookCore: string;
    whyItMatters: string;
    keyTerms: string[];
    blocks: LessonBlock[];
  };
  quickExplain: string;
  analogy: string;
  memoryHook: string;
  miniJoke: string;
  keyTakeaways: string[];
  visualType: MissionVisualBlock["type"];
  visualData: MissionVisualBlock;
  knowledge: {
    definitions: string[];
    distinctions: string[];
    examples: string[];
    names: string[];
    datesOrContext: string[];
    mustRemember: string[];
  };
  answerStrategy: string;
  oralAnswer: {
    short: string;
    expanded: string;
    answer40sec: string;
    answer2min: string;
    answerSkeleton: string[];
    keyPhrases: string[];
  };
  mustKnow: string[];
  teacherQuestions: string[];
  teacherTraps: TeacherTrap[];
  steps: MissionStep[];
  finalBossQuestion: BossStep;
};

export type TeacherTrap = {
  id: string;
  falseStatement: string;
  correction: string;
  topic: string;
};

export type MissionStep =
  | ChoiceStep
  | DuelStep
  | ArgumentStep
  | TrapStep
  | BossStep;

export type BaseStep = {
  id: string;
  seminarId: SeminarId;
  topic: string;
  coveredTopics: string[];
  scene: string;
};

export type ChoiceStep = BaseStep & {
  type: "choice";
  question: string;
  options: string[];
  correctOptionIndex: number;
  correctFeedback: string;
  wrongFeedback: string;
  explanation: string;
};

export type DuelStep = BaseStep & {
  type: "duel";
  leftLabel: string;
  rightLabel: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export type ArgumentStep = BaseStep & {
  type: "argument";
  question: string;
  fragments: string[];
  correctOrder: number[];
  finalOralAnswer: string;
  explanation: string;
};

export type TrapStep = BaseStep & {
  type: "trap";
  falseStatement: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export type BossStep = BaseStep & {
  type: "boss";
  question: string;
  hint: string;
  shortAnswer: string;
  expandedAnswer: string;
  commonMistake: string;
  followUpQuestion: string;
};

export type UserProgress = {
  selectedSeminarId: SeminarId;
  xp: number;
  streak: number;
  hearts: number;
  completedMissionIds: string[];
  weakStepIds: string[];
  masteredStepIds: string[];
  weakTopicIds: string[];
  currentWorldId: string;
  currentMissionId: string;
  completedQuestionIds: string[];
  progressBySeminar: Record<SeminarId, {
    completedMissionIds: string[];
    weakStepIds: string[];
    weakTopicIds: string[];
    masteredStepIds: string[];
    currentWorldId: string;
    currentMissionId: string;
    completedQuestionIds: string[];
    lastPlayedAt: string | null;
  }>;
  lastPlayedBySeminar: Partial<Record<SeminarId, string | null>>;
  lastPlayedAt: string | null;
};

export type Screen =
  | "home"
  | "campaign"
  | "assignment"
  | "mission"
  | "weak"
  | "finalBoss"
  | "coverage"
  | "data";
