export type Aesthetic =
  | "medieval"
  | "scholastic"
  | "renaissance"
  | "newTime"
  | "enlightenment"
  | "finalBoss";

export type WorldVisual = {
  imageUrl?: string;
  imageAlt: string;
  moodKeywords: string[];
  fallbackGradient: string;
  pixelAccent: string;
};

export type World = {
  id: string;
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
  number: number;
  title: string;
  source: "assignment-sheet" | "assignment-sheet-inferred";
  wording: string;
  subpoints: string[];
  teacherMayAsk: string[];
  mustKnow: string[];
  missionIds: string[];
};

export type NotebookTerm = {
  id: string;
  label: string;
  assignmentPages: string[];
  shortMeaning: string;
  intentionallyStandalone?: boolean;
};

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
  worldId: string;
  seminarQuestionId: string;
  assignmentQuestionId: "q1" | "q2" | "q3" | "q4" | "q5" | "q-final";
  assignmentSubtopic: string;
  directAssignmentPrompt: string;
  sourceStatus: "textbook_verified" | "assignment_based" | "needs_textbook_review";
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
  xp: number;
  streak: number;
  hearts: number;
  completedMissionIds: string[];
  weakStepIds: string[];
  masteredStepIds: string[];
  weakTopicIds: string[];
  currentWorldId: string;
  currentMissionId: string;
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
