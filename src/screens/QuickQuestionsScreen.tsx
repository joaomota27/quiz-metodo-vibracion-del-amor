import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import SoundToggle from '../components/SoundToggle';

interface QuickAnswers { q6: string; q7: string; q8: string; }

interface Props {
  initialValues?: Partial<QuickAnswers>;
  onAnswer: (vals: QuickAnswers) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

function MiniOption({ label, text, selected, onClick }: { label: string; text: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '10px 12px', borderRadius: 16, cursor: 'pointer',
        border: `2px solid ${selected ? '#e8539c' : '#fce8f3'}`,
        background: selected ? 'rgba(232,83,156,0.07)' : 'white',
        transition: 'all 0.2s ease',
        minWidth: 68,
        boxShadow: selected ? '0 0 14px rgba(232,83,156,0.2)' : 'none',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600,
        background: selected ? 'linear-gradient(135deg,#e8539c,#f27db8)' : '#fce8f3',
        color: selected ? 'white' : '#e8539c',
        transition: 'all 0.2s ease',
      }}>
        {label}
      </div>
      <span style={{
        fontSize: 11, textAlign: 'center', lineHeight: 1.3,
        color: selected ? '#9d235e' : '#6b7280',
        fontWeight: selected ? 500 : 400,
      }}>
        {text}
      </span>
    </button>
  );
}

interface QDef {
  key: 'q6' | 'q7' | 'q8';
  question: string;
  options: { label: string; text: string }[];
}

const QUESTIONS: QDef[] = [
  {
    key: 'q6',
    question: '¿Te resulta fácil aceptar cumplidos?',
    options: [{ label: 'A', text: 'Sí' }, { label: 'B', text: 'A veces' }, { label: 'C', text: 'No' }],
  },
  {
    key: 'q7',
    question: '¿Con qué frecuencia dudas de tu propio valor?',
    options: [{ label: 'A', text: 'Nunca' }, { label: 'B', text: 'Algunas veces' }, { label: 'C', text: 'Frecuentemente' }, { label: 'D', text: 'Casi siempre' }],
  },
  {
    key: 'q8',
    question: '¿Estarías dispuesta a dedicar unos minutos al día para fortalecer tu bienestar emocional?',
    options: [{ label: 'A', text: 'Sí, completamente.' }, { label: 'B', text: 'Creo que sí.' }, { label: 'C', text: 'Quiero intentarlo.' }],
  },
];

export default function QuickQuestionsScreen({ initialValues, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [step, setStep] = useState(0);
  const [q6, setQ6] = useState(initialValues?.q6 ?? '');
  const [q7, setQ7] = useState(initialValues?.q7 ?? '');
  const [q8, setQ8] = useState(initialValues?.q8 ?? '');

  const currentQ = QUESTIONS[step];
  const currentVal = step === 0 ? q6 : step === 1 ? q7 : q8;
  const setters = [setQ6, setQ7, setQ8] as const;

  function handleSelect(label: string) {
    setters[step](label);
  }

  // Auto-advance after selection
  useEffect(() => {
    if (!currentVal) return;
    const t = setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1);
      } else {
        const vals = { q6, q7, q8 };
        vals[QUESTIONS[step].key] = currentVal;
        onAnswer(vals);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [currentVal, step, q6, q7, q8, onAnswer]);

  const isLast = step === QUESTIONS.length - 1;

  return (
    <div
      className="quiz-screen anim-slide-in-right"
      style={{ background: 'linear-gradient(180deg,#fff0f5 0%,#fce8f3 100%)' }}
    >
      {/* Header */}
      <div className="quiz-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Preguntas Rápidas
          </span>
          <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
        </div>
        <ProgressBar current={step + 6} total={8} />
      </div>

      {/* Body */}
      <div className="quiz-body">
        <h2
          key={step}
          className="anim-fade-up delay-100 compact-font"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 18, lineHeight: 1.35,
            color: '#1f2937', textAlign: 'center', marginBottom: 20,
          }}
        >
          {currentQ.question}
        </h2>

        <div
          key={`opts-${step}`}
          className="anim-fade-up delay-200 compact-gap"
          style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}
        >
          {currentQ.options.map(o => (
            <MiniOption
              key={o.label}
              label={o.label}
              text={o.text}
              selected={currentVal === o.label}
              onClick={() => handleSelect(o.label)}
            />
          ))}
        </div>

        {isLast && currentVal && (
          <p className="anim-fade-in" style={{
            textAlign: 'center', fontSize: 12, color: '#f27db8', fontStyle: 'italic', marginTop: 16,
          }}>
            ¡Casi terminamos! Tu resultado está siendo preparado…
          </p>
        )}
      </div>

      {/* Footer — progress dots for sub-steps */}
      <div className="quiz-footer" style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8,
            height: 8,
            borderRadius: 999,
            background: i <= step ? 'linear-gradient(90deg,#e8539c,#f27db8)' : '#fce8f3',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}
