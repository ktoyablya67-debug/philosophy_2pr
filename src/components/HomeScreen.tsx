import { missions, seminars, seminarQuestions, worlds } from "../data/gameData";
import type { SeminarId, UserProgress } from "../types";
import { levelFromXp, seminarReadiness } from "../utils/progress";
import { PixelButton } from "./PixelButton";
import { PixelScene } from "./PixelScene";
import { ProgressBar } from "./ProgressBar";

type Props = {
  progress: UserProgress;
  onSelectSeminar: (id: SeminarId) => void;
  onContinue: () => void;
  onCampaign: () => void;
  onAssignment: () => void;
  onQuickFight: () => void;
  onFinalBoss: () => void;
  onWeak: () => void;
  onCoverage: () => void;
  onData: () => void;
};

export function HomeScreen({ progress, onSelectSeminar, onContinue, onCampaign, onAssignment, onQuickFight, onFinalBoss, onWeak, onCoverage, onData }: Props) {
  const mission = missions.find((item) => item.id === progress.currentMissionId) ?? missions[0];
  const world = worlds.find((item) => item.id === mission.worldId) ?? worlds[0];
  const selectedSeminar = seminars.find((seminar) => seminar.id === progress.selectedSeminarId) ?? seminars[0];
  const readiness = seminarReadiness(progress);
  const weak = progress.weakTopicIds.slice(0, 5);

  return (
    <section className="home-grid">
      <div className="hero-panel">
        <PixelScene aesthetic={world.aesthetic} visual={world.visual} title={world.title} />
        <div className="hero-copy">
          <p className="eyebrow">{selectedSeminar.title}</p>
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
          <PixelButton onClick={onAssignment}>Вопросы листка</PixelButton>
          <PixelButton onClick={onFinalBoss}>Финальный босс</PixelButton>
          <PixelButton onClick={onWeak}>Слабые места</PixelButton>
          <PixelButton onClick={onCoverage}>Проверка покрытия</PixelButton>
          <PixelButton variant="ghost" onClick={onData}>Data Check</PixelButton>
        </div>
      </aside>
      <section className="lesson-panel seminar-picker">
        <p className="eyebrow">Выбери семинар</p>
        <h2>Кампании PhiloQuest</h2>
        <div className="card-grid">
          {seminars.map((seminar) => {
            const seminarMissions = missions.filter((item) => item.seminarId === seminar.id);
            const seminarProgress = progress.progressBySeminar[seminar.id];
            const completed = seminarProgress.completedMissionIds.length;
            const questions = seminarQuestions.filter((question) => question.seminarId === seminar.id).length;
            const weak = seminarProgress.weakTopicIds.length;
            return (
              <article className={`mini-card ${seminar.aesthetic}`} key={seminar.id}>
                <p className="eyebrow">{seminar.id === progress.selectedSeminarId ? "выбран" : seminar.title}</p>
                <h3>{seminar.title}</h3>
                <p>{seminar.subtitle}</p>
                <p>{seminar.description}</p>
                <ProgressBar value={Math.round((completed / Math.max(1, seminarMissions.length)) * 100)} label="Прогресс" />
                <div className="tag-row">
                  <span className="badge">{questions} вопросов</span>
                  <span className="badge">{seminarMissions.length} миссий</span>
                  <span className={weak ? "badge danger" : "badge"}>{weak} слабых мест</span>
                </div>
                <PixelButton onClick={() => onSelectSeminar(seminar.id)}>Учить</PixelButton>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
