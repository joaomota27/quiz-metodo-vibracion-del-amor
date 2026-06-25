interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#fce8f3' }}>
            <div
              className="h-full rounded-full progress-bar-fill"
              style={{
                width: i < current ? '100%' : '0%',
                transition: `width 0.4s ease ${i * 0.05}s`,
              }}
            />
          </div>
        ))}
      </div>
      <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#f27db8' }}>
        {current}/{total}
      </span>
    </div>
  );
}
