interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({ value, size = 140, stroke = 12, label, sublabel }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const offset = c - (v / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="font-display text-3xl font-semibold tabular-nums text-foreground">{label}</span>}
        {sublabel && <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}