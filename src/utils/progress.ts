import type { MissionStep, SeminarId, UserProgress } from "../types";
import { missions, requiredTopics } from "../data/gameData";

const unique = (items: string[]) => Array.from(new Set(items));

export function seminarReadiness(progress: UserProgress) {
  const seminarMissions = missions.filter((mission) => mission.seminarId === progress.selectedSeminarId);
  const completed = new Set(progress.completedMissionIds);
  const missionScore = completed.size / Math.max(1, seminarMissions.length);
  const weakPenalty = Math.min(0.35, progress.weakTopicIds.length / requiredTopics.length);
  return Math.max(0, Math.round((missionScore * 0.85 + Math.min(progress.xp / 1800, 1) * 0.15 - weakPenalty) * 100));
}

export function levelFromXp(xp: number) {
  return Math.floor(xp / 180) + 1;
}

export function markCorrect(progress: UserProgress, step: MissionStep): UserProgress {
  const seminarId = step.seminarId;
  const seminarProgress = progress.progressBySeminar[seminarId];
  const updatedSeminar = {
    ...seminarProgress,
    masteredStepIds: unique([...seminarProgress.masteredStepIds, step.id]),
    lastPlayedAt: new Date().toISOString(),
  };
  return {
    ...progress,
    xp: progress.xp + (step.type === "boss" ? 30 : 15),
    streak: progress.streak + 1,
    masteredStepIds: seminarId === progress.selectedSeminarId ? updatedSeminar.masteredStepIds : progress.masteredStepIds,
    progressBySeminar: { ...progress.progressBySeminar, [seminarId]: updatedSeminar },
    lastPlayedBySeminar: { ...progress.lastPlayedBySeminar, [seminarId]: updatedSeminar.lastPlayedAt },
    lastPlayedAt: updatedSeminar.lastPlayedAt,
  };
}

export function markWrong(progress: UserProgress, step: MissionStep): UserProgress {
  const seminarId = step.seminarId;
  const seminarProgress = progress.progressBySeminar[seminarId];
  const updatedSeminar = {
    ...seminarProgress,
    weakStepIds: unique([...seminarProgress.weakStepIds, step.id]),
    weakTopicIds: unique([...seminarProgress.weakTopicIds, ...step.coveredTopics]),
    lastPlayedAt: new Date().toISOString(),
  };
  return {
    ...progress,
    streak: 0,
    hearts: Math.max(0, progress.hearts - 1),
    weakStepIds: seminarId === progress.selectedSeminarId ? updatedSeminar.weakStepIds : progress.weakStepIds,
    weakTopicIds: seminarId === progress.selectedSeminarId ? updatedSeminar.weakTopicIds : progress.weakTopicIds,
    progressBySeminar: { ...progress.progressBySeminar, [seminarId]: updatedSeminar },
    lastPlayedBySeminar: { ...progress.lastPlayedBySeminar, [seminarId]: updatedSeminar.lastPlayedAt },
    lastPlayedAt: updatedSeminar.lastPlayedAt,
  };
}

export function restoreHearts(progress: UserProgress): UserProgress {
  return { ...progress, hearts: 3, lastPlayedAt: new Date().toISOString() };
}

export function completeMission(progress: UserProgress, missionId: string, worldId: string): UserProgress {
  const mission = missions.find((item) => item.id === missionId);
  const seminarId = mission?.seminarId ?? progress.selectedSeminarId;
  const seminarMissions = missions.filter((item) => item.seminarId === seminarId);
  const index = seminarMissions.findIndex((item) => item.id === missionId);
  const nextMission = seminarMissions[index + 1] ?? seminarMissions[index];
  const seminarProgress = progress.progressBySeminar[seminarId];
  const updatedSeminar = {
    ...seminarProgress,
    completedMissionIds: unique([...seminarProgress.completedMissionIds, missionId]),
    currentMissionId: nextMission.id,
    currentWorldId: nextMission.worldId || worldId,
    completedQuestionIds: mission ? unique([...seminarProgress.completedQuestionIds, mission.seminarQuestionId]) : seminarProgress.completedQuestionIds,
    lastPlayedAt: new Date().toISOString(),
  };
  return {
    ...progress,
    hearts: 3,
    completedMissionIds: seminarId === progress.selectedSeminarId ? updatedSeminar.completedMissionIds : progress.completedMissionIds,
    currentMissionId: seminarId === progress.selectedSeminarId ? updatedSeminar.currentMissionId : progress.currentMissionId,
    currentWorldId: seminarId === progress.selectedSeminarId ? updatedSeminar.currentWorldId : progress.currentWorldId,
    completedQuestionIds: seminarId === progress.selectedSeminarId ? updatedSeminar.completedQuestionIds : progress.completedQuestionIds,
    progressBySeminar: { ...progress.progressBySeminar, [seminarId]: updatedSeminar },
    lastPlayedBySeminar: { ...progress.lastPlayedBySeminar, [seminarId]: updatedSeminar.lastPlayedAt },
    lastPlayedAt: updatedSeminar.lastPlayedAt,
  };
}

export function selectSeminar(progress: UserProgress, seminarId: SeminarId): UserProgress {
  const seminarProgress = progress.progressBySeminar[seminarId];
  return {
    ...progress,
    selectedSeminarId: seminarId,
    completedMissionIds: seminarProgress.completedMissionIds,
    weakStepIds: seminarProgress.weakStepIds,
    weakTopicIds: seminarProgress.weakTopicIds,
    masteredStepIds: seminarProgress.masteredStepIds,
    currentWorldId: seminarProgress.currentWorldId,
    currentMissionId: seminarProgress.currentMissionId,
    completedQuestionIds: seminarProgress.completedQuestionIds,
  };
}
