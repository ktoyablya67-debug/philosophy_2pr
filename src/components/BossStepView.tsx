import { useState } from "react";
import type { BossStep } from "../types";
import { PixelButton } from "./PixelButton";

type Props = { step: BossStep; onAnswer: (correct: boolean) => void; onNext: () => void };

export function BossStepView({ step, onAnswer, onNext }: Props) {
  const [open, setOpen] = useState(false);
  const [rated, setRated] = useState(false);

  function rate(value: "good" | "part" | "bad") {
    setRated(true);
    onAnswer(value === "good");
  }

  return (
    <div className="step-card boss-card">
      <p className="step-type">Устный мини-босс</p>
      <h2>{step.question}</h2>
      <p className="hint">Подсказка: {step.hint}</p>
      {!open && <PixelButton onClick={() => setOpen(true)}>Показать идеальный ответ</PixelButton>}
      {open && (
        <div className="answer-panel">
          <h3>Короткий ответ</h3>
          <p>{step.shortAnswer}</p>
          <h3>Развёрнутый ответ</h3>
          <p>{step.expandedAnswer}</p>
          <h3>Типичная ошибка</h3>
          <p>{step.commonMistake}</p>
          <h3>Дополнительный вопрос</h3>
          <p>{step.followUpQuestion}</p>
          {!rated ? (
            <div className="rating-row">
              <PixelButton onClick={() => rate("good")}>ответила уверенно</PixelButton>
              <PixelButton variant="ghost" onClick={() => rate("part")}>частично</PixelButton>
              <PixelButton variant="danger" onClick={() => rate("bad")}>не ответила</PixelButton>
            </div>
          ) : (
            <PixelButton onClick={onNext}>Дальше</PixelButton>
          )}
        </div>
      )}
    </div>
  );
}
