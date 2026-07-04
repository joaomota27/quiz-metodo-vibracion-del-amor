import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import SoundToggle from '../components/SoundToggle';

interface WelcomeScreenProps {
  onStart: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

// Partículas de brilho flutuantes
interface Spark {
  id: number; x: number; y: number;
  size: number; dur: number; dly: number; opacity: number;
}

function makeSparkles(n: number): Spark[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 65,
    size: 2 + Math.random() * 3,
    dur: 4 + Math.random() * 5,
    dly: Math.random() * 6,
    opacity: 0.4 + Math.random() * 0.5,
  }));
}

const SPARKLES = makeSparkles(18);

export default function WelcomeScreen({ onStart, soundEnabled, onSoundToggle }: WelcomeScreenProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Leve parallax ao tocar/mover no mobile
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 12;
      const ny = (e.clientY / window.innerHeight - 0.5) * 8;
      el!.style.transform = `translate(${nx}px, ${ny}px) scale(1.06)`;
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#1a0820',
    }}>

      {/* ── Imagem de fundo com parallax ── */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-6%',
          backgroundImage: "url('/welcome-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)',
          willChange: 'transform',
        }}
      />

      {/* ── Overlay graduado premium ── */}
      {/* Topo transparente → respira a imagem */}
      {/* Meio levíssimo → a mulher ainda aparece */}
      {/* Fundo 85% → texto legível com elegância */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'linear-gradient(180deg,',
          '  rgba(10,2,18,0.45)   0%,',
          '  rgba(10,2,18,0.38)  18%,',
          '  rgba(10,2,18,0.42)  38%,',
          '  rgba(12,3,20,0.60)  52%,',
          '  rgba(14,3,22,0.78)  64%,',
          '  rgba(16,4,24,0.90)  76%,',
          '  rgba(16,4,24,0.97)  88%,',
          '  rgba(16,4,24,0.99) 100%',
          ')',
        ].join(''),
      }} />

      {/* ── Partículas brilhantes (sobre o céu) ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        {SPARKLES.map(s => (
          <div
            key={s.id}
            className="anim-drift-up"
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,220,240,0.9) 0%, rgba(255,180,210,0.3) 100%)',
              '--dur': `${s.dur}s`,
              '--dly': `${s.dly}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── Nuvem sutil animada (apenas cor, não imagem) ── */}
      <div
        className="anim-wave-cloud"
        style={{
          position: 'absolute', top: '8%', left: '-5%',
          width: '55%', height: 60,
          background: 'radial-gradient(ellipse, rgba(255,210,230,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      {/* ── Top bar: logo + sound toggle ── */}
      <div style={{
        position: 'relative', zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 24px 0',
      }}>
        {/* Logo mark */}
        <div
          className="anim-hero"
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 22" style={{ width: 14, height: 14 }}>
              <path
                d="M12 20S2 13.5 2 7A5.5 5.5 0 0 1 12 5 5.5 5.5 0 0 1 22 7C22 13.5 12 20 12 20Z"
                fill="none"
                stroke="rgba(255,185,215,0.9)"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Vibración del Amor™
          </span>
        </div>

        <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} dark />
      </div>

      {/* ── Conteúdo central ── */}
      <div style={{
        position: 'relative', zIndex: 20,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 26px 40px',
      }}>

        {/* Badge sutil */}
        <div
          className="anim-hero"
          style={{ animationDelay: '0.15s', marginBottom: 20, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px',
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#f9a8d4',
              boxShadow: '0 0 6px rgba(249,168,212,0.8)',
            }} />
            <span style={{
              fontSize: 10.5, fontWeight: 500,
              color: 'rgba(255,255,255,0.78)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Evaluación Oficial · Gratuita
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="anim-hero"
          style={{
            animationDelay: '0.28s',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 26,
            lineHeight: 1.32,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.97)',
            textAlign: 'center',
            marginBottom: 14,
            letterSpacing: '-0.01em',
          }}
        >
          La mayoría de las mujeres nunca descubre qué está bloqueando su{' '}
          <em style={{
            fontStyle: 'italic',
            background: 'linear-gradient(90deg, #f9a8d4, #fbc8de, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            apertura al amor
          </em>
          .
        </h1>

        {/* Subheadline */}
        <p
          className="anim-hero"
          style={{
            animationDelay: '0.42s',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.62)',
            fontSize: 14,
            lineHeight: 1.6,
            fontWeight: 300,
            marginBottom: 28,
            letterSpacing: '0.01em',
          }}
        >
          Descúbrelo en menos de 3 minutos con la{' '}
          <span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 400 }}>
            Evaluación de Vibración Emocional™
          </span>
        </p>

        {/* Benefícios — 3 itens sem card */}
        <div
          className="anim-hero"
          style={{
            animationDelay: '0.56s',
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: <IconInstant />, label: 'Resultado inmediato' },
            { icon: <IconPersonal />, label: 'Evaluación personalizada' },
            { icon: <IconClock />,    label: 'Solo 3 minutos' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 13px',
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span style={{ color: '#f9a8d4', display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA principal */}
        <div
          className="anim-hero"
          style={{ animationDelay: '0.7s' }}
        >
          <button
            onClick={onStart}
            className="cta-btn"
            style={{ fontSize: 15.5, letterSpacing: '0.02em', padding: '17px 2rem' }}
          >
            Comenzar evaluación
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Trust line */}
        <div
          className="anim-hero"
          style={{
            animationDelay: '0.85s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            marginTop: 16,
          }}
        >
          <Lock size={10} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.02em' }}>
            Tu información está 100% protegida
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Ícones outline minimalistas ──────────────────────────

function IconInstant() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5"/>
      <path d="M8 4.5v4l2.5 1.5"/>
    </svg>
  );
}

function IconPersonal() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5.5" r="2.5"/>
      <path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5"/>
      <path d="M8 5v3.5l2 1.2"/>
    </svg>
  );
}
