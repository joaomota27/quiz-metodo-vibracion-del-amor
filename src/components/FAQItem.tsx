import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid #fce8f3', borderRadius: 16, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 16, background: 'white', cursor: 'pointer', border: 'none',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151', paddingRight: 12, lineHeight: 1.4 }}>
          {question}
        </span>
        <div style={{
          flexShrink: 0, color: '#f27db8',
          transition: 'transform 0.25s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <ChevronDown size={18} />
        </div>
      </button>
      <div style={{
        maxHeight: open ? 200 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
        background: 'rgba(253,244,248,0.5)',
      }}>
        <p style={{ padding: '0 16px 16px', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
          {answer}
        </p>
      </div>
    </div>
  );
}
