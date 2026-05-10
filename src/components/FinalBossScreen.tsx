import { useMemo, useState } from "react";
import { bossQuestions } from "../data/gameData";
import type { BossStep, UserProgress } from "../types";
import { markCorrect, markWrong } from "../utils/progress";
import { BossStepView } from "./BossStepView";
import { PixelButton } from "./PixelButton";
import { PixelScene } from "./PixelScene";
import { ProgressBar } from "./ProgressBar";

type Props = { progress: UserProgress; setProgress: (progress: UserProgress) => void; onDone: () => void };

export function FinalBossScreen({ progress, setProgress, onDone }: Props) {
  const questions = useMemo(() => bossQuestions.filter((_, index) => index % 2 === 0).slice(0, 12), []);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const done = index >= questions.length;
  const step = questions[index] as BossStep | undefined;

  function answer(correct: boolean) {
    if (!step || step.id in scores) return;
    setScores({ ...scores, [step.id]: correct });
    setProgress(correct ? markCorrect(progress, step) : markWrong(progress, step));
  }

  if (done) {
    const strong = questions.filter((question) => scores[question.id]).flatMap((question) => question.coveredTopics).slice(0, 8);
    const weak = questions.filter((question) => !scores[question.id]).flatMap((question) => question.coveredTopics).slice(0, 8);
    return (
      <section className="screen-stack final-result">
        <PixelScene aesthetic="finalBoss" title="Финальный босс завершён" />
        <h1>Результат: {Object.values(scores).filter(Boolean).length}/{questions.length}</h1>
        <h2>Сильные темы</h2>
        <div className="tag-row">{strong.length ? strong.map((topic) => <span className="badge" key={topic}>{topic}</span>) : <span className="badge">пока нет</span>}</div>
        <h2>Повторить за 15 минут</h2>
        <div className="tag-row">{weak.length ? weak.map((topic) => <span className="badge danger" key={topic}>{topic}</span>) : <span className="badge">связки эпох и авторов</span>}</div>
        <p>Быстрый план: проговорить теоцентризм, спор веры и разума, Возрождение, Бэкона с Декартом и три версии общественного договора.</p>
        <PixelButton onClick={onDone}>На главный экран</PixelButton>
      </section>
    );
  }

  if (!step) return null;

  return (
    <section className="mission-screen finalBoss">
      <PixelScene aesthetic="finalBoss" title="Строгий преподаватель" />
      <ProgressBar value={Math.round(((index + 1) / questions.length) * 100)} label="Финальный босс" />
      <BossStepView step={step} onAnswer={answer} onNext={() => setIndex(index + 1)} />
    </section>
  );
}
