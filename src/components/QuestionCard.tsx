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
  autoAdvance?: boolean;
}

export default function QuestionCard({
  stepNumber, totalSteps, question, microfeedback, children,
  soundEnabled, onSoundToggle, onNext, canNext, nextLabel = 'Continuar',
  autoAdvance = false,
}: QuestionCardProps) {
  return (
    <div
      className="quiz-screen anim-slide-in-right"
      style={{ background: 'linear-gradient(180deg,#fff0f5 0%,#fce8f3 100%)' }}
    >
      {/* Header */}
      <div className="quiz-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Evaluación Emocional™
          </span>
          <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
        </div>
        <ProgressBar current={stepNumber} total={totalSteps} />
      </div>

      {/* Content */}
      <div className="quiz-body">
        <h2
          className="anim-fade-up delay-100 compact-font"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 20, lineHeight: 1.35,
            color: '#1f2937', textAlign: 'center', marginBottom: 20,
          }}
        >
          {question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="compact-gap">
          {children}
        </div>

        {microfeedback && canNext && !autoAdvance && (
          <p className="anim-fade-in delay-200" style={{
            textAlign: 'center', fontSize: 12, color: '#f27db8', fontStyle: 'italic', marginTop: 16,
          }}>
            {microfeedback}
          </p>
        )}
      </div>

      {/* Footer */}
      {!autoAdvance && (
        <div className="quiz-footer">
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
      )}
    </div>
  );
}
