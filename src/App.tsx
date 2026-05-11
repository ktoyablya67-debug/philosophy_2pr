import { useEffect, useState } from "react";
import { CampaignScreen } from "./components/CampaignScreen";
import { AssignmentSheetScreen } from "./components/AssignmentSheetScreen";
import { CoverageCheckScreen } from "./components/CoverageCheckScreen";
import { DataCheckScreen } from "./components/DataCheckScreen";
import { FinalBossScreen } from "./components/FinalBossScreen";
import { HomeScreen } from "./components/HomeScreen";
import { Layout } from "./components/Layout";
import { MissionScreen } from "./components/MissionScreen";
import { WeakSpotsScreen } from "./components/WeakSpotsScreen";
import { missions } from "./data/gameData";
import type { LearningMission, Screen, SeminarId, UserProgress } from "./types";
import { selectSeminar } from "./utils/progress";
import { loadProgress, resetProgress, saveProgress } from "./utils/storage";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [progress, setProgressState] = useState<UserProgress>(() => loadProgress());
  const [activeMissionId, setActiveMissionId] = useState(progress.currentMissionId);
  const [quickFight, setQuickFight] = useState(false);

  useEffect(() => saveProgress(progress), [progress]);

  const setProgress = (next: UserProgress) => setProgressState(next);
  const activeMission: LearningMission = missions.find((mission) => mission.id === activeMissionId) ?? missions[0];

  function openMission(id: string) {
    setQuickFight(false);
    setActiveMissionId(id);
    setScreen("mission");
  }

  function chooseSeminar(id: SeminarId) {
    const next = selectSeminar(progress, id);
    setProgressState(next);
    setActiveMissionId(next.currentMissionId);
    setScreen("home");
  }

  function openQuickFight() {
    setQuickFight(true);
    setActiveMissionId(progress.currentMissionId);
    setScreen("mission");
  }

  function resetAll() {
    const next = resetProgress();
    setProgressState(next);
    setActiveMissionId(next.currentMissionId);
    setScreen("home");
  }

  return (
    <Layout screen={screen} onNavigate={setScreen} onReset={resetAll}>
      {screen === "home" && (
        <HomeScreen
          progress={progress}
          onSelectSeminar={chooseSeminar}
          onContinue={() => openMission(progress.currentMissionId)}
          onCampaign={() => setScreen("campaign")}
          onAssignment={() => setScreen("assignment")}
          onQuickFight={openQuickFight}
          onFinalBoss={() => setScreen("finalBoss")}
          onWeak={() => setScreen("weak")}
          onCoverage={() => setScreen("coverage")}
          onData={() => setScreen("data")}
        />
      )}
      {screen === "campaign" && <CampaignScreen progress={progress} onOpenMission={openMission} />}
      {screen === "assignment" && <AssignmentSheetScreen progress={progress} onOpenMission={openMission} />}
      {screen === "mission" && (
        <MissionScreen
          mission={activeMission}
          quickFight={quickFight}
          progress={progress}
          setProgress={setProgress}
          onBack={() => setScreen("campaign")}
          onDone={() => setScreen("home")}
        />
      )}
      {screen === "weak" && <WeakSpotsScreen progress={progress} onOpenMission={openMission} />}
      {screen === "finalBoss" && <FinalBossScreen progress={progress} setProgress={setProgress} onDone={() => setScreen("home")} />}
      {screen === "coverage" && <CoverageCheckScreen seminarId={progress.selectedSeminarId} />}
      {screen === "data" && <DataCheckScreen />}
    </Layout>
  );
}
