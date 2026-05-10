import { useMemo, useState } from "react";
import { allSteps, worlds } from "../data/gameData";
import type { LearningMission, MissionStep, UserProgress } from "../types";
import { completeMission, markCorrect, markWrong, restoreHearts } from "../utils/progress";
import { PixelButton } from "./PixelButton";
import { PixelScene } from "./PixelScene";
import { ProgressBar } from "./ProgressBar";
import { StepRenderer } from "./StepRenderer";

type Props = {
  mission: LearningMission;
  quickFight: boolean;
  progress: UserProgress;
  setProgress: (progress: UserProgress) => void;
  onBack: () => void;
  onDone: () => void;
};

function quickSteps(): MissionStep[] {
  return [...allSteps].sort((a, b) => a.id.localeCompare(b.id)).filter((_, index) => index % 3 === 0).slice(0, 10);
}

export function MissionScreen({ mission, quickFight, progress, setProgress, onBack, onDone }: Props) {
  const world = worlds.find((item) => item.id === mission.worldId) ?? worlds[0];
  const steps = useMemo(() => (quickFight ? quickSteps() : mission.steps), [quickFight, mission]);
  const [introDone, setIntroDone] = useState(quickFight);
  const [index, setIndex] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const step = steps[index];
  const percent = Math.round(((index + (introDone ? 1 : 0)) / (steps.length + (quickFight ? 0 : 1))) * 100);

  function answer(correct: boolean) {
    if (answeredIds.includes(step.id)) return;
    setAnsweredIds([...answeredIds, step.id]);
    setProgress(correct ? markCorrect(progress, step) : markWrong(progress, step));
  }

  function next() {
    if (index < steps.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (!quickFight) setProgress(completeMission(progress, mission.id, mission.worldId));
    onDone();
  }

  if (!introDone) {
    return (
      <section className={`mission-screen ${world.aesthetic}`}>
        <div className="mission-top">
          <PixelButton variant="ghost" onClick={onBack}>Назад</PixelButton>
          <span>XP {progress.xp}</span>
          <span>Сердца {"♥".repeat(progress.hearts) || "0"}</span>
        </div>
        <ProgressBar value={percent} label="Миссия" />
        <PixelScene aesthetic={world.aesthetic} visual={world.visual} title={mission.title} />
        <article className="lesson-panel">
          <p className="eyebrow">{world.title}</p>
          <h1>{mission.title}</h1>
          <div className="source-box">
            <strong>Источник</strong>
            <span>Вопрос листка: {mission.seminarQuestionId}</span>
            <span>Учебник: {mission.sourceRefs.textbookSections.join(", ")}</span>
            <span>Страницы: {mission.sourceRefs.textbookPages.join(", ")}</span>
            <span>Статус: {mission.sourceStatus.replace(/_/g, " ")}</span>
          </div>
          <p className="scene-text">{mission.scene}</p>
          <h2>Объяснение с нуля</h2>
          <p>{mission.lesson.simpleExplanation}</p>
          <h2>Ядро темы</h2>
          <p>{mission.lesson.textbookCore}</p>
          <h2>Зачем это для семинара</h2>
          <p>{mission.lesson.whyItMatters}</p>
          <div className="tag-row">{mission.lesson.keyTerms.map((term) => <span className="badge" key={term}>{term}</span>)}</div>
          <h2>Готовый устный ответ</h2>
          <p>{mission.oralAnswer.short}</p>
          <details>
            <summary>Развёрнутый ответ на 2 минуты</summary>
            <p>{mission.oralAnswer.expanded}</p>
          </details>
          <PixelButton className="big" onClick={() => setIntroDone(true)}>Перейти к заданиям</PixelButton>
        </article>
      </section>
    );
  }

  return (
    <section className={`mission-screen ${world.aesthetic}`}>
      <div className="mission-top">
        <PixelButton variant="ghost" onClick={onBack}>Назад</PixelButton>
        <span>{quickFight ? "Быстрый бой" : mission.title}</span>
        <span>XP {progress.xp}</span>
        <span>Сердца {"♥".repeat(progress.hearts) || "0"}</span>
      </div>
      <ProgressBar value={Math.round(((index + 1) / steps.length) * 100)} label="Задания" />
      {progress.hearts === 0 && (
        <div className="hearts-box">
          <strong>Сердца закончились.</strong>
          <p>Можно продолжать, но лучше восстановить сердца через повторение объяснения.</p>
          <PixelButton onClick={() => setProgress(restoreHearts(progress))}>Восстановить сердца</PixelButton>
        </div>
      )}
      <StepRenderer step={step} onAnswer={answer} onNext={next} />
    </section>
  );
}
