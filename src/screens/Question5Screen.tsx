import { useState } from 'react';
import { Heart, Shield, Leaf, Sparkles } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import React from 'react';

const OPTIONS: { label: string; text: string; icon: React.ReactNode; color: string }[] = [
  { label: 'A', text: 'Amor propio.', icon: <Heart size={16} fill="currentColor" />, color: '#e8539c' },
  { label: 'B', text: 'Confianza.', icon: <Shield size={16} />, color: '#60a5fa' },
  { label: 'C', text: 'Paz interior.', icon: <Leaf size={16} />, color: '#4ade80' },
  { label: 'D', text: 'Apertura al amor.', icon: <Sparkles size={16} />, color: '#fbbf24' },
];

interface Props {
  initialValue?: string;
  onAnswer: (val: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function Question5Screen({ initialValue, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [selected, setSelected] = useState<string>(initialValue ?? '');

  return (
    <QuestionCard
      stepNumber={5} totalSteps={6}
      question="Si pudieras fortalecer una sola área de tu vida emocional hoy, ¿cuál elegirías?"
      microfeedback="Tu resultado está tomando forma…"
      soundEnabled={soundEnabled} onSoundToggle={onSoundToggle}
      onNext={() => { if (selected) onAnswer(selected); }}
      canNext={!!selected}
    >
      {OPTIONS.map(opt => (
        <button
          key={opt.label}
          onClick={() => setSelected(opt.label)}
          className={`answer-card anim-fade-up ${selected === opt.label ? 'selected' : ''}`}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
            background: selected === opt.label ? 'linear-gradient(135deg,#e8539c,#f27db8)' : '#fce8f3',
            color: selected === opt.label ? 'white' : opt.color,
            boxShadow: selected === opt.label ? '0 0 12px rgba(232,83,156,0.4)' : 'none',
            border: selected === opt.label ? 'none' : '1px solid #fbd1e9',
          }}>
            {opt.icon}
          </div>
          <span style={{
            fontSize: 14, lineHeight: 1.4, flex: 1, textAlign: 'left',
            color: selected === opt.label ? '#9d235e' : '#4b5563',
            fontWeight: selected === opt.label ? 500 : 400,
          }}>
            {opt.text}
          </span>
          {selected === opt.label && (
            <div className="anim-scale-in" style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#e8539c,#f27db8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </button>
      ))}
    </QuestionCard>
  );
}
