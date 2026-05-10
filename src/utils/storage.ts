import type { UserProgress } from "../types";

const KEY = "philoquest-seminar-2-progress";

export const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  hearts: 3,
  completedMissionIds: [],
  weakStepIds: [],
  masteredStepIds: [],
  weakTopicIds: [],
  currentWorldId: "w1",
  currentMissionId: "m01",
  lastPlayedAt: null,
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeProgress(value: unknown): UserProgress {
  if (!value || typeof value !== "object") return defaultProgress;
  const candidate = value as Partial<UserProgress>;
  return {
    xp: typeof candidate.xp === "number" ? candidate.xp : 0,
    streak: typeof candidate.streak === "number" ? candidate.streak : 0,
    hearts: typeof candidate.hearts === "number" ? Math.max(0, Math.min(3, candidate.hearts)) : 3,
    completedMissionIds: isStringArray(candidate.completedMissionIds) ? candidate.completedMissionIds : [],
    weakStepIds: isStringArray(candidate.weakStepIds) ? candidate.weakStepIds : [],
    masteredStepIds: isStringArray(candidate.masteredStepIds) ? candidate.masteredStepIds : [],
    weakTopicIds: isStringArray(candidate.weakTopicIds) ? candidate.weakTopicIds : [],
    currentWorldId: typeof candidate.currentWorldId === "string" ? candidate.currentWorldId : "w1",
    currentMissionId: typeof candidate.currentMissionId === "string" ? candidate.currentMissionId : "m01",
    lastPlayedAt: typeof candidate.lastPlayedAt === "string" ? candidate.lastPlayedAt : null,
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultProgress;
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
