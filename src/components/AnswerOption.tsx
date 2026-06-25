import React from 'react';

interface AnswerOptionProps {
  label: string;
  text: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function AnswerOption({ label, text, selected, onClick, icon }: AnswerOptionProps) {
  return (
    <button onClick={onClick} className={`answer-card anim-fade-up ${selected ? 'selected' : ''}`}>
      <div
        style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600,
          transition: 'all 0.2s ease',
          background: selected ? 'linear-gradient(135deg,#e8539c,#f27db8)' : '#fce8f3',
          color: selected ? 'white' : '#e8539c',
          boxShadow: selected ? '0 0 12px rgba(232,83,156,0.4)' : 'none',
          border: selected ? 'none' : '1px solid #fbd1e9',
        }}
      >
        {icon ?? label}
      </div>
      <span style={{
        fontSize: 14, lineHeight: 1.4,
        color: selected ? '#9d235e' : '#4b5563',
        fontWeight: selected ? 500 : 400,
        transition: 'color 0.2s ease',
        flex: 1,
        textAlign: 'left',
      }}>
        {text}
      </span>
      {selected && (
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#e8539c,#f27db8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} className="anim-scale-in">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}
