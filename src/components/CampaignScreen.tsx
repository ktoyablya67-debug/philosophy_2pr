import { missions, seminars, worlds } from "../data/gameData";
import type { UserProgress } from "../types";
import { PixelButton } from "./PixelButton";
import { PixelScene } from "./PixelScene";
import { ProgressBar } from "./ProgressBar";

type Props = {
  progress: UserProgress;
  onOpenMission: (id: string) => void;
};

export function CampaignScreen({ progress, onOpenMission }: Props) {
  const selectedSeminar = seminars.find((seminar) => seminar.id === progress.selectedSeminarId) ?? seminars[0];
  const seminarWorlds = worlds.filter((world) => world.seminarId === progress.selectedSeminarId);
  return (
    <section className="screen-stack">
      <div className="section-head">
        <p className="eyebrow">Карта кампании</p>
        <h1>{selectedSeminar.title}</h1>
        <p>{selectedSeminar.subtitle}</p>
      </div>
      <div className="world-grid">
        {seminarWorlds.map((world) => {
          const worldMissions = world.missionIds.map((id) => missions.find((mission) => mission.id === id && mission.seminarId === progress.selectedSeminarId)).filter(Boolean);
          const completed = worldMissions.filter((mission) => progress.completedMissionIds.includes(mission!.id)).length;
          return (
            <article className={`world-card ${world.aesthetic}`} key={world.id}>
              <PixelScene aesthetic={world.aesthetic} visual={world.visual} title={world.title} />
              <h2>{world.title}</h2>
              <p>{world.description}</p>
              <ProgressBar value={Math.round((completed / worldMissions.length) * 100)} label="Прогресс мира" />
              <div className="mission-ladder">
                {worldMissions.map((mission, index) => (
                  <button
                    className={`mission-node ${progress.completedMissionIds.includes(mission!.id) ? "done" : ""}`}
                    key={mission!.id}
                    onClick={() => onOpenMission(mission!.id)}
                  >
                    <span>{index + 1}</span>
                    <strong>{mission!.title}</strong>
                  </button>
                ))}
              </div>
              <PixelButton onClick={() => onOpenMission(world.missionIds[0])}>Начать мир</PixelButton>
            </article>
          );
        })}
      </div>
    </section>
  );
}
