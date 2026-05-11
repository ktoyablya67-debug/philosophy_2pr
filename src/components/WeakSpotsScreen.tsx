import { missions } from "../data/gameData";
import type { UserProgress } from "../types";
import { PixelButton } from "./PixelButton";

type Props = { progress: UserProgress; onOpenMission: (id: string) => void };

export function WeakSpotsScreen({ progress, onOpenMission }: Props) {
  const weakMissions = missions.filter((mission) => mission.seminarId === progress.selectedSeminarId && mission.requiredTopics.some((topic) => progress.weakTopicIds.includes(topic)));
  return (
    <section className="screen-stack">
      <div className="section-head">
        <p className="eyebrow">Диагностика</p>
        <h1>Слабые места</h1>
      </div>
      {progress.weakTopicIds.length === 0 ? (
        <article className="lesson-panel"><p>Ошибок пока нет. Пройди несколько миссий или быстрый бой, и здесь появятся темы для повторения.</p></article>
      ) : (
        <>
          <div className="tag-row">{progress.weakTopicIds.map((topic) => <span className="badge danger" key={topic}>{topic}</span>)}</div>
          <div className="card-grid">
            {weakMissions.map((mission) => (
              <article className="mini-card" key={mission.id}>
                <h2>{mission.title}</h2>
                <p>{mission.lesson.whyItMatters}</p>
                <PixelButton onClick={() => onOpenMission(mission.id)}>Повторить миссию</PixelButton>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
