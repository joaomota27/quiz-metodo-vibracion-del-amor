interface TestimonialCardProps {
  text: string;
  author: string;
  age: number;
}

export default function TestimonialCard({ text, author, age }: TestimonialCardProps) {
  return (
    <div className="glass-card" style={{ borderRadius: 24, padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#e8539c">
            <path d="M7 1l1.545 3.09L12 4.545l-2.5 2.455.59 3.455L7 8.91 4.91 10.455 5.5 7 3 4.545l3.455-.455L7 1z"/>
          </svg>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 10, fontStyle: 'italic' }}>"{text}"</p>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#e8539c' }}>— {author}, {age} años</p>
    </div>
  );
}
