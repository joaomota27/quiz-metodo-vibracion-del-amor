import { useState } from 'react';
import QuestionCard from '../components/QuestionCard';

const LABELS = ['', 'Muy poco conectada', 'Poco conectada', 'Medianamente conectada', 'Bastante conectada', 'Muy conectada'];

interface Props {
  initialValue?: number;
  onAnswer: (val: number) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function Question3Screen({ initialValue, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [value, setValue] = useState<number>(initialValue ?? 3);

  return (
    <QuestionCard
      stepNumber={3} totalSteps={8}
      question="¿Qué tan conectada te sientes contigo misma hoy?"
      microfeedback="Tu resultado está tomando forma…"
      soundEnabled={soundEnabled} onSoundToggle={onSoundToggle}
      onNext={() => onAnswer(value)}
      canNext={true}
      nextLabel="Continuar"
    >
      {/* Dot slider */}
      <div style={{ padding: '0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>
          <span>Muy poco<br/>conectada</span>
          <span style={{ textAlign: 'right' }}>Muy<br/>conectada</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map(v => (
            <button
              key={v}
              onClick={() => setValue(v)}
              style={{
                width: value === v ? 48 : 38,
                height: value === v ? 48 : 38,
                borderRadius: '50%',
                border: `2px solid ${value === v ? '#e8539c' : '#fbd1e9'}`,
                background: value === v ? 'linear-gradient(135deg,#e8539c,#f27db8)' : '#fce8f3',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.25s ease',
                boxShadow: value === v ? '0 0 16px rgba(232,83,156,0.4)' : 'none',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: value === v ? 'white' : '#e8539c' }}>{v}</span>
            </button>
          ))}
        </div>

        {/* Track */}
        <div style={{ height: 6, background: '#fce8f3', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%',
            width: `${((value - 1) / 4) * 100}%`,
            background: 'linear-gradient(90deg,#e8539c,#f27db8)',
            borderRadius: 999,
            transition: 'width 0.3s ease',
          }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#e8539c', fontWeight: 500 }}>
          {LABELS[value]}
        </p>
      </div>
    </QuestionCard>
  );
}
