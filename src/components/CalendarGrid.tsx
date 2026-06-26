import { Check } from 'lucide-react';

interface Props {
  totalDays?: number;
  completedDays?: number[];
  currentDay?: number;
  onDayClick?: (day: number) => void;
}

export default function CalendarGrid({
  totalDays = 30,
  completedDays = [],
  currentDay = 1,
  onDayClick,
}: Props) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="calendar-grid">
      {days.map(d => <DayCell key={d} day={d} completed={completedDays.includes(d)} current={d === currentDay} onClick={onDayClick} />)}
    </div>
  );
}

function DayCell({ day, completed, current, onClick }: { day: number; completed: boolean; current: boolean; onClick?: (d: number) => void }) {
  const bg = completed
    ? 'linear-gradient(135deg,#e8539c,#f27db8)'
    : current
    ? 'rgba(232,83,156,0.15)'
    : 'rgba(255,255,255,0.06)';
  const color = completed ? 'white' : current ? '#e8539c' : 'rgba(255,255,255,0.4)';
  const border = current ? '2px solid #e8539c' : '1px solid rgba(255,255,255,0.08)';

  return (
    <button
      className="calendar-day"
      onClick={() => onClick?.(day)}
      style={{ background: bg, color, border }}
    >
      {completed ? <Check size={14} strokeWidth={3} /> : day}
    </button>
  );
}
