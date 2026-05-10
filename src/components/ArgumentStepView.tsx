import { useState } from "react";
import type { ArgumentStep } from "../types";
import { PixelButton } from "./PixelButton";

type Props = { step: ArgumentStep; onAnswer: (correct: boolean) => void; onNext: () => void };

export function ArgumentStepView({ step, onAnswer, onNext }: Props) {
  const [order, setOrder] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && order.every((item, index) => item === step.correctOrder[index]);

  function pick(index: number) {
    if (!order.includes(index) && !checked) setOrder([...order, index]);
  }

  return (
    <div className="step-card">
      <p className="step-type">Собери устный ответ</p>
      <h2>{step.question}</h2>
      <div className="argument-zones">
        <div>
          <h3>Фрагменты</h3>
          {step.fragments.map((fragment, index) => (
            <button className="fragment" key={fragment} disabled={order.includes(index) || checked} onClick={() => pick(index)}>
              {fragment}
            </button>
          ))}
        </div>
        <div>
          <h3>Твой порядок</h3>
          {order.map((index, slot) => (
            <button className="fragment selected" key={index} disabled={checked} onClick={() => setOrder(order.filter((item) => item !== index))}>
              {slot + 1}. {step.fragments[index]}
            </button>
          ))}
        </div>
      </div>
      {!checked && <PixelButton disabled={order.length !== step.fragments.length} onClick={() => { setChecked(true); onAnswer(order.every((item, index) => item === step.correctOrder[index])); }}>Проверить</PixelButton>}
      {checked && (
        <div className={`feedback ${isCorrect ? "good" : "bad"}`}>
          <strong>{isCorrect ? "Порядок сильный." : "Порядок нужно поправить."}</strong>
          <p>{step.explanation}</p>
          <blockquote>{step.finalOralAnswer}</blockquote>
          <PixelButton onClick={onNext}>Дальше</PixelButton>
        </div>
      )}
    </div>
  );
}
