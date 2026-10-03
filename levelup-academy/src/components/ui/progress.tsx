export function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progress'}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/8"
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${value}%` }} />
    </div>
  );
}
