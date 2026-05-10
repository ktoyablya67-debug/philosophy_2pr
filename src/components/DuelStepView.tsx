import { useState } from "react";
import type { DuelStep } from "../types";
import { PixelButton } from "./PixelButton";

type Props = { step: DuelStep; onAnswer: (correct: boolean) => void; onNext: () => void };

export function DuelStepView({ step, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="step-card duel-card">
      <p className="step-type">Дуэль позиций</p>
      <div className="duel-header">
        <span>{step.leftLabel}</span>
        <b>VS</b>
        <span>{step.rightLabel}</span>
      </div>
      <h2>{step.question}</h2>
      <div className="option-list">
        {step.options.map((option, index) => (
          <button
            className={`option ${selected === index ? (index === step.correctOptionIndex ? "correct" : "wrong") : ""}`}
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
        <div className="feedback">
          <p>{step.explanation}</p>
          <PixelButton onClick={onNext}>Дальше</PixelButton>
        </div>
      )}
    </div>
  );
}
