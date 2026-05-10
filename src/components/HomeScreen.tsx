import { missions, worlds } from "../data/gameData";
import type { UserProgress } from "../types";
import { levelFromXp, seminarReadiness } from "../utils/progress";
import { PixelButton } from "./PixelButton";
import { PixelScene } from "./PixelScene";
import { ProgressBar } from "./ProgressBar";

type Props = {
  progress: UserProgress;
  onContinue: () => void;
  onCampaign: () => void;
  onQuickFight: () => void;
  onFinalBoss: () => void;
  onWeak: () => void;
  onCoverage: () => void;
  onData: () => void;
};

export function HomeScreen({ progress, onContinue, onCampaign, onQuickFight, onFinalBoss, onWeak, onCoverage, onData }: Props) {
  const mission = missions.find((item) => item.id === progress.currentMissionId) ?? missions[0];
  const world = worlds.find((item) => item.id === mission.worldId) ?? worlds[0];
  const readiness = seminarReadiness(progress);
  const weak = progress.weakTopicIds.slice(0, 5);

  return (
    <section className="home-grid">
      <div className="hero-panel">
        <PixelScene aesthetic={world.aesthetic} visual={world.visual} title={world.title} />
        <div className="hero-copy">
          <p className="eyebrow">Семинар 2</p>
          <h1>PhiloQuest</h1>
          <p>{world.keyIdea}</p>
          <div className="hero-actions">
            <PixelButton className="big" onClick={onContinue}>Продолжить кампанию</PixelButton>
            <PixelButton variant="ghost" onClick={onQuickFight}>Быстрый бой</PixelButton>
          </div>
        </div>
      </div>
      <aside className="status-panel">
        <div className="stat-row"><span>Уровень</span><strong>{levelFromXp(progress.xp)}</strong></div>
        <div className="stat-row"><span>XP</span><strong>{progress.xp}</strong></div>
        <div className="stat-row"><span>Streak</span><strong>{progress.streak}</strong></div>
        <div className="stat-row"><span>Сердца</span><strong>{"♥".repeat(progress.hearts) || "0"}</strong></div>
        <ProgressBar value={readiness} label="Готовность" />
        <div className="weak-list">
          <h2>Слабые темы</h2>
          {weak.length ? weak.map((topic) => <span className="badge" key={topic}>{topic}</span>) : <p>Пока нет слабых тем.</p>}
        </div>
        <div className="button-grid">
          <PixelButton onClick={onCampaign}>Карта кампании</PixelButton>
          <PixelButton onClick={onFinalBoss}>Финальный босс</PixelButton>
          <PixelButton onClick={onWeak}>Слабые места</PixelButton>
          <PixelButton onClick={onCoverage}>Проверка покрытия</PixelButton>
          <PixelButton variant="ghost" onClick={onData}>Data Check</PixelButton>
        </div>
      </aside>
    </section>
  );
}
