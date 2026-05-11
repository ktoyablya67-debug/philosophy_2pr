import type { SeminarId, UserProgress } from "../types";

const KEY = "philoquest-progress-v2";
const OLD_KEY = "philoquest-seminar-2-progress";

const seminarDefaults: Record<SeminarId, { worldId: string; missionId: string }> = {
  seminar2: { worldId: "w1", missionId: "q1m01" },
  seminar3: { worldId: "s3w1", missionId: "s3q1m01" },
  seminar7: { worldId: "s7w1", missionId: "s7ch1m01" },
};

export const defaultProgress: UserProgress = {
  selectedSeminarId: "seminar2",
  xp: 0,
  streak: 0,
  hearts: 3,
  completedMissionIds: [],
  weakStepIds: [],
  masteredStepIds: [],
  weakTopicIds: [],
  currentWorldId: "w1",
  currentMissionId: "q1m01",
  completedQuestionIds: [],
  progressBySeminar: {
    seminar2: { completedMissionIds: [], weakStepIds: [], weakTopicIds: [], masteredStepIds: [], currentWorldId: "w1", currentMissionId: "q1m01", completedQuestionIds: [], lastPlayedAt: null },
    seminar3: { completedMissionIds: [], weakStepIds: [], weakTopicIds: [], masteredStepIds: [], currentWorldId: "s3w1", currentMissionId: "s3q1m01", completedQuestionIds: [], lastPlayedAt: null },
    seminar7: { completedMissionIds: [], weakStepIds: [], weakTopicIds: [], masteredStepIds: [], currentWorldId: "s7w1", currentMissionId: "s7ch1m01", completedQuestionIds: [], lastPlayedAt: null },
  },
  lastPlayedBySeminar: {},
  lastPlayedAt: null,
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeProgress(value: unknown): UserProgress {
  if (!value || typeof value !== "object") return defaultProgress;
  const candidate = value as Partial<UserProgress>;
  const selectedSeminarId: SeminarId = candidate.selectedSeminarId === "seminar3" || candidate.selectedSeminarId === "seminar7" ? candidate.selectedSeminarId : "seminar2";
  const oldCompleted = isStringArray(candidate.completedMissionIds) ? candidate.completedMissionIds : [];
  const oldWeakSteps = isStringArray(candidate.weakStepIds) ? candidate.weakStepIds : [];
  const oldWeakTopics = isStringArray(candidate.weakTopicIds) ? candidate.weakTopicIds : [];
  const oldMastered = isStringArray(candidate.masteredStepIds) ? candidate.masteredStepIds : [];
  const sourceBySeminar = (candidate.progressBySeminar ?? {}) as Partial<UserProgress["progressBySeminar"]>;
  const progressBySeminar = (Object.keys(seminarDefaults) as SeminarId[]).reduce<UserProgress["progressBySeminar"]>((acc, seminarId) => {
    const source = (sourceBySeminar[seminarId] ?? {}) as Partial<UserProgress["progressBySeminar"][SeminarId]>;
    const fallback = seminarDefaults[seminarId];
    acc[seminarId] = {
      completedMissionIds: isStringArray(source.completedMissionIds) ? source.completedMissionIds : seminarId === "seminar2" ? oldCompleted : [],
      weakStepIds: isStringArray(source.weakStepIds) ? source.weakStepIds : seminarId === "seminar2" ? oldWeakSteps : [],
      weakTopicIds: isStringArray(source.weakTopicIds) ? source.weakTopicIds : seminarId === "seminar2" ? oldWeakTopics : [],
      masteredStepIds: isStringArray(source.masteredStepIds) ? source.masteredStepIds : seminarId === "seminar2" ? oldMastered : [],
      currentWorldId: typeof source.currentWorldId === "string" ? source.currentWorldId : seminarId === "seminar2" && typeof candidate.currentWorldId === "string" ? candidate.currentWorldId : fallback.worldId,
      currentMissionId: typeof source.currentMissionId === "string" ? source.currentMissionId : seminarId === "seminar2" && typeof candidate.currentMissionId === "string" ? candidate.currentMissionId : fallback.missionId,
      completedQuestionIds: isStringArray(source.completedQuestionIds) ? source.completedQuestionIds : [],
      lastPlayedAt: typeof source.lastPlayedAt === "string" ? source.lastPlayedAt : null,
    };
    return acc;
  }, {} as UserProgress["progressBySeminar"]);
  const selected = progressBySeminar[selectedSeminarId];
  return {
    selectedSeminarId,
    xp: typeof candidate.xp === "number" ? candidate.xp : 0,
    streak: typeof candidate.streak === "number" ? candidate.streak : 0,
    hearts: typeof candidate.hearts === "number" ? Math.max(0, Math.min(3, candidate.hearts)) : 3,
    completedMissionIds: selected.completedMissionIds,
    weakStepIds: selected.weakStepIds,
    masteredStepIds: selected.masteredStepIds,
    weakTopicIds: selected.weakTopicIds,
    currentWorldId: selected.currentWorldId,
    currentMissionId: selected.currentMissionId,
    completedQuestionIds: selected.completedQuestionIds,
    progressBySeminar,
    lastPlayedBySeminar: candidate.lastPlayedBySeminar ?? {},
    lastPlayedAt: typeof candidate.lastPlayedAt === "string" ? candidate.lastPlayedAt : null,
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const oldRaw = window.localStorage.getItem(OLD_KEY);
      if (oldRaw) return normalizeProgress(JSON.parse(oldRaw));
      return defaultProgress;
    }
    return normalizeProgress(JSON.parse(raw));
  } catch {
    saveProgress(defaultProgress);
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // The app stays usable even when storage is unavailable.
  }
}

export function resetProgress() {
  saveProgress(defaultProgress);
  return defaultProgress;
}
