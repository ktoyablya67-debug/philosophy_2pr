import type { MissionStep, UserProgress } from "../types";
import { missions, requiredTopics } from "../data/gameData";

const unique = (items: string[]) => Array.from(new Set(items));

export function seminarReadiness(progress: UserProgress) {
  const completed = new Set(progress.completedMissionIds);
  const missionScore = completed.size / missions.length;
  const weakPenalty = Math.min(0.35, progress.weakTopicIds.length / requiredTopics.length);
  return Math.max(0, Math.round((missionScore * 0.85 + Math.min(progress.xp / 1800, 1) * 0.15 - weakPenalty) * 100));
}

export function levelFromXp(xp: number) {
  return Math.floor(xp / 180) + 1;
}

export function markCorrect(progress: UserProgress, step: MissionStep): UserProgress {
  return {
    ...progress,
    xp: progress.xp + (step.type === "boss" ? 30 : 15),
    streak: progress.streak + 1,
    masteredStepIds: unique([...progress.masteredStepIds, step.id]),
    lastPlayedAt: new Date().toISOString(),
  };
}

export function markWrong(progress: UserProgress, step: MissionStep): UserProgress {
  return {
    ...progress,
    streak: 0,
    hearts: Math.max(0, progress.hearts - 1),
    weakStepIds: unique([...progress.weakStepIds, step.id]),
    weakTopicIds: unique([...progress.weakTopicIds, ...step.coveredTopics]),
    lastPlayedAt: new Date().toISOString(),
  };
}

export function restoreHearts(progress: UserProgress): UserProgress {
  return { ...progress, hearts: 3, lastPlayedAt: new Date().toISOString() };
}

export function completeMission(progress: UserProgress, missionId: string, worldId: string): UserProgress {
  const index = missions.findIndex((mission) => mission.id === missionId);
  const nextMission = missions[index + 1] ?? missions[index];
  return {
    ...progress,
    hearts: 3,
    completedMissionIds: unique([...progress.completedMissionIds, missionId]),
    currentMissionId: nextMission.id,
    currentWorldId: nextMission.worldId || worldId,
    lastPlayedAt: new Date().toISOString(),
  };
}
