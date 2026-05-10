type Props = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-wrap" aria-label={label ?? "Прогресс"}>
      <div className="progress-label">
        <span>{label ?? "Прогресс"}</span>
        <strong>{safeValue}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
