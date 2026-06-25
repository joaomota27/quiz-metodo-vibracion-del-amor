import React from 'react';
import ProgressBar from './ProgressBar';
import SoundToggle from './SoundToggle';

interface QuestionCardProps {
  stepNumber: number;
  totalSteps: number;
  question: string;
  microfeedback?: string;
  children: React.ReactNode;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
}

export default function QuestionCard({
  stepNumber, totalSteps, question, microfeedback, children,
  soundEnabled, onSoundToggle, onNext, canNext, nextLabel = 'Continuar',
}: QuestionCardProps) {
  return (
    <div
      className="anim-slide-in-right"
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg,#fff0f5 0%,#fce8f3 100%)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Evaluación Emocional™
          </span>
          <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
        </div>
        <ProgressBar current={stepNumber} total={totalSteps} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '8px 20px 16px' }}>
        <h2
          className="anim-fade-up delay-100"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 20, lineHeight: 1.35,
            color: '#1f2937', textAlign: 'center', marginBottom: 24,
          }}
        >
          {question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {children}
        </div>

        {microfeedback && canNext && (
          <p className="anim-fade-in delay-200" style={{
            textAlign: 'center', fontSize: 12, color: '#f27db8', fontStyle: 'italic', marginTop: 16,
          }}>
            {microfeedback}
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 20px 32px' }}>
        <button
          onClick={canNext ? onNext : undefined}
          disabled={!canNext}
          className={canNext ? 'cta-btn' : ''}
          style={!canNext ? {
            width: '100%', padding: '1rem 2rem', borderRadius: 9999,
            fontWeight: 600, fontSize: '1rem',
            background: '#f3f4f6', color: '#9ca3af',
            border: 'none', cursor: 'not-allowed',
          } : undefined}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
