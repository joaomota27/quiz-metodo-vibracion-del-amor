import { useEffect, useState, useRef } from 'react';
import { playParticleSound } from '../utils/sound';

const MESSAGES = [
  'Analizando tus respuestas...',
  'Identificando patrones emocionales...',
  'Calculando tu nivel de amor propio...',
  'Evaluando tu apertura emocional...',
  'Generando tu resultado personalizado...',
];

interface Particle {
  id: number; x: number; y: number; size: number;
  dur: number; dly: number; color: string;
}

const COLORS = ['#e8539c', '#f27db8', '#fbd1e9', '#c47b8a', 'rgba(255,255,255,0.8)', '#f8d4e8'];

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 5,
    dur: 3 + Math.random() * 4,
    dly: Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

interface Props {
  onComplete: () => void;
  soundEnabled: boolean;
}

export default function ProcessingScreen({ onComplete, soundEnabled }: Props) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(MESSAGES[0]);
  const particles = useRef<Particle[]>(makeParticles(28));
  const soundRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const total = 4200;
    const step = 42;
    let cur = 0;
    const steps = Math.ceil(total / step);

    const timer = setInterval(() => {
      cur++;
      const pct = Math.min(100, Math.round((cur / steps) * 100));
      setProgress(pct);
      const idx = Math.min(MESSAGES.length - 1, Math.floor((pct / 100) * MESSAGES.length));
      setMsgIndex(idx);
      setCurrentMsg(MESSAGES[idx]);
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setDone(true);
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 500);
      }
    }, step);

    if (soundEnabled) {
      soundRef.current = setInterval(() => playParticleSound(), 700);
    }

    return () => {
      clearInterval(timer);
      if (soundRef.current) clearInterval(soundRef.current);
    };
  }, [soundEnabled, onComplete]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg,#0f0612 0%,#1a0c1f 30%,#2d1533 60%,#4a1a5e 100%)',
    }}>
      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.current.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              background: p.color,
              '--dur': `${p.dur}s`,
              '--dly': `${p.dly}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Ripple + heart */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: 80 + i * 40, height: 80 + i * 40,
            borderRadius: '50%',
            border: '1px solid rgba(232,83,156,0.2)',
            animation: `ripple 2s ease-out ${i * 0.5}s infinite`,
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1, width: 72, height: 72 }}>
          <svg viewBox="0 0 80 72" className="anim-heartbeat" style={{ width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="hGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f27db8"/>
                <stop offset="100%" stopColor="#e8539c"/>
              </radialGradient>
              <filter id="gf">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <path d="M40 64S6 44 6 22A16 16 0 0 1 40 16 16 16 0 0 1 74 22C74 44 40 64 40 64Z"
              fill="url(#hGlow)" filter="url(#gf)"/>
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 240, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{
          height: '100%', borderRadius: 999,
          background: 'linear-gradient(90deg,#e8539c,#f27db8,#e8539c)',
          backgroundSize: '200% 100%',
          width: `${progress}%`,
          transition: 'width 0.1s linear',
          animation: 'shimmer 2s linear infinite',
        }} />
      </div>

      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20 }}>{progress}%</p>

      {/* Message */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p key={msgIndex} className="anim-fade-up" style={{ color: 'rgba(255,255,255,0.78)', fontSize: 14, textAlign: 'center', padding: '0 32px' }}>
          {currentMsg}
        </p>
      </div>

      {/* Done */}
      {done && (
        <div className="anim-fade-up" style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", color: 'white', fontSize: 20 }}>
            Tu resultado está listo.
          </p>
          <button onClick={onComplete} className="cta-btn anim-pulse-glow" style={{ width: 'auto', padding: '1rem 2.5rem' }}>
            Ver mi resultado
          </button>
        </div>
      )}
    </div>
  );
}
