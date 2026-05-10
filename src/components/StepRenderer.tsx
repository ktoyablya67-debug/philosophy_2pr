import type { MissionStep } from "../types";
import { ArgumentStepView } from "./ArgumentStepView";
import { BossStepView } from "./BossStepView";
import { ChoiceStepView } from "./ChoiceStepView";
import { DuelStepView } from "./DuelStepView";
import { TrapStepView } from "./TrapStepView";

type Props = { step: MissionStep; onAnswer: (correct: boolean) => void; onNext: () => void };

export function StepRenderer({ step, onAnswer, onNext }: Props) {
  if (step.type === "choice") return <ChoiceStepView step={step} onAnswer={onAnswer} onNext={onNext} />;
  if (step.type === "duel") return <DuelStepView step={step} onAnswer={onAnswer} onNext={onNext} />;
  if (step.type === "argument") return <ArgumentStepView step={step} onAnswer={onAnswer} onNext={onNext} />;
  if (step.type === "trap") return <TrapStepView step={step} onAnswer={onAnswer} onNext={onNext} />;
  return <BossStepView step={step} onAnswer={onAnswer} onNext={onNext} />;
}
