import { useState } from "react";
import type { ChoiceStep } from "../types";
import { PixelButton } from "./PixelButton";

type Props = { step: ChoiceStep; onAnswer: (correct: boolean) => void; onNext: () => void };

export function ChoiceStepView({ step, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === step.correctOptionIndex;
  return (
    <div className="step-card">
      <p className="step-type">Выбор</p>
      <h2>{step.question}</h2>
      <div className="option-list">
        {step.options.map((option, index) => (
          <button
            className={`option ${selected === index ? (correct ? "correct" : "wrong") : ""}`}
            key={option}
            disabled={selected !== null}
            onClick={() => {
              setSelected(index);
              onAnswer(index === step.correctOptionIndex);
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className={`feedback ${correct ? "good" : "bad"}`}>
          <strong>{correct ? step.correctFeedback : step.wrongFeedback}</strong>
          <p>{step.explanation}</p>
          <PixelButton onClick={onNext}>Дальше</PixelButton>
        </div>
      )}
    </div>
  );
}
