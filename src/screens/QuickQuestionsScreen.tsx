import { useState } from 'react';
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

const Q6_OPTS = [{ label: 'A', text: 'Sí' }, { label: 'B', text: 'A veces' }, { label: 'C', text: 'No' }];
const Q7_OPTS = [{ label: 'A', text: 'Nunca' }, { label: 'B', text: 'Algunas veces' }, { label: 'C', text: 'Frecuentemente' }, { label: 'D', text: 'Casi siempre' }];
const Q8_OPTS = [{ label: 'A', text: 'Sí, completamente.' }, { label: 'B', text: 'Creo que sí.' }, { label: 'C', text: 'Quiero intentarlo.' }];

export default function QuickQuestionsScreen({ initialValues, onAnswer, soundEnabled, onSoundToggle }: Props) {
  const [q6, setQ6] = useState(initialValues?.q6 ?? '');
  const [q7, setQ7] = useState(initialValues?.q7 ?? '');
  const [q8, setQ8] = useState(initialValues?.q8 ?? '');

  const canNext = !!q6 && !!q7 && !!q8;

  return (
    <div className="anim-slide-in-right" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg,#fff0f5 0%,#fce8f3 100%)',
    }}>
      <div style={{ padding: '20px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Preguntas Rápidas
          </span>
          <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
        </div>
        <ProgressBar current={6} total={6} />
      </div>

      <div style={{ flex: 1, padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {/* Q6 */}
        <div className="glass-card anim-fade-up delay-100" style={{ borderRadius: 24, padding: 20 }}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 16, color: '#1f2937', textAlign: 'center', marginBottom: 16, lineHeight: 1.35 }}>
            ¿Te resulta fácil aceptar cumplidos?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {Q6_OPTS.map(o => <MiniOption key={o.label} label={o.label} text={o.text} selected={q6 === o.label} onClick={() => setQ6(o.label)} />)}
          </div>
        </div>

        {/* Q7 */}
        <div className="glass-card anim-fade-up delay-200" style={{ borderRadius: 24, padding: 20 }}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 16, color: '#1f2937', textAlign: 'center', marginBottom: 16, lineHeight: 1.35 }}>
            ¿Con qué frecuencia dudas de tu propio valor?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {Q7_OPTS.map(o => <MiniOption key={o.label} label={o.label} text={o.text} selected={q7 === o.label} onClick={() => setQ7(o.label)} />)}
          </div>
        </div>

        {/* Q8 */}
        <div className="glass-card anim-fade-up delay-300" style={{ borderRadius: 24, padding: 20 }}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 16, color: '#1f2937', textAlign: 'center', marginBottom: 16, lineHeight: 1.35 }}>
            ¿Estarías dispuesta a dedicar unos minutos al día para fortalecer tu bienestar emocional?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {Q8_OPTS.map(o => <MiniOption key={o.label} label={o.label} text={o.text} selected={q8 === o.label} onClick={() => setQ8(o.label)} />)}
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 20px 32px' }}>
        {canNext && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#f27db8', fontStyle: 'italic', marginBottom: 10 }}>
            ¡Casi terminamos! Tu resultado está siendo preparado…
          </p>
        )}
        <button
          onClick={() => canNext && onAnswer({ q6, q7, q8 })}
          disabled={!canNext}
          className={canNext ? 'cta-btn' : ''}
          style={!canNext ? {
            width: '100%', padding: '1rem 2rem', borderRadius: 9999,
            fontWeight: 600, fontSize: '1rem',
            background: '#f3f4f6', color: '#9ca3af',
            border: 'none', cursor: 'not-allowed',
          } : undefined}
        >
          Ver mi resultado
        </button>
      </div>
    </div>
  );
}
