import { useEffect, useState, useRef } from 'react';
import type { Scores } from '../types';
import { getLowestDimension, getPersonalizedText } from '../utils/scoring';
import CTAButton from '../components/CTAButton';
import SoundToggle from '../components/SoundToggle';
import { playResultSound } from '../utils/sound';

interface BarProps { label: string; emoji: string; value: number; color: string; delay: number; }

const RESULT_BODY_FONT = 'clamp(14px, 4vw, 18px)';
const RESULT_TITLE_FONT = 'clamp(18px, 5vw, 28px)';

function DimensionBar({ label, emoji, value, color, delay }: BarProps) {
  const [displayed, setDisplayed] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      setBarWidth(value);
      const start = performance.now();
      const duration = 1200;
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{emoji}</span>
          <span style={{ fontSize: RESULT_BODY_FONT, fontWeight: 500, color: 'rgba(255,255,255,0.88)' }}>{label}</span>
        </div>
        <span style={{ fontSize: RESULT_BODY_FONT, fontWeight: 600, color: 'white' }}>{displayed}%</span>
      </div>
      <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 999, background: color,
          width: `${barWidth}%`,
          transition: `width 1.2s cubic-bezier(0.34,1.56,0.64,1) ${delay / 1000 + 0.3}s`,
        }} />
      </div>
    </div>
  );
}

interface Props {
  scores: Scores;
  onContinue: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function ResultScreen({ scores, onContinue, soundEnabled, onSoundToggle }: Props) {
  const lowest = getLowestDimension(scores);
  const personalizedText = getPersonalizedText(lowest);

  useEffect(() => {
    if (soundEnabled) setTimeout(() => playResultSound(), 700);
  }, [soundEnabled]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflowX = html.style.overflowX;
    const previousHtmlWidth = html.style.width;
    const previousBodyOverflowX = body.style.overflowX;
    const previousBodyWidth = body.style.width;

    html.style.overflowX = 'hidden';
    html.style.width = '100%';
    body.style.overflowX = 'hidden';
    body.style.width = '100%';

    return () => {
      html.style.overflowX = previousHtmlOverflowX;
      html.style.width = previousHtmlWidth;
      body.style.overflowX = previousBodyOverflowX;
      body.style.width = previousBodyWidth;
    };
  }, []);

  const dims = [
    { key: 'amorPropio',        label: 'Amor Propio',       emoji: '💗', value: scores.amorPropio,        color: 'linear-gradient(90deg,#e8539c,#f27db8)', delay: 200 },
    { key: 'confianza',         label: 'Confianza',         emoji: '🌸', value: scores.confianza,         color: 'linear-gradient(90deg,#c47b8a,#e8539c)', delay: 600 },
    { key: 'pazInterior',       label: 'Paz Interior',      emoji: '🕊',  value: scores.pazInterior,       color: 'linear-gradient(90deg,#a78bd4,#c9a8e8)', delay: 1000 },
    { key: 'aberturaEmocional', label: 'Apertura Emocional',emoji: '✨', value: scores.aberturaEmocional, color: 'linear-gradient(90deg,#f4c460,#f27db8)', delay: 1400 },
  ];

  return (
    <div className="resultado-page scrollbar-hide" style={{
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom: 100,
      background: 'linear-gradient(180deg,#1a0c1f 0%,#2d1533 40%,#3d1a4e 100%)',
    }}>
      <style>
        {`
          .resultado-page,
          .resultado-page * {
            max-width: 100%;
            box-sizing: border-box;
          }
        `}
      </style>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
        <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} dark />
      </div>

      <div style={{ padding: '0 20px 140px' }}>
        {/* Title */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="anim-scale-in delay-200" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg,#e8539c,#f27db8)',
            }}>
              <svg viewBox="0 0 40 36" fill="white" style={{ width: 28, height: 28 }}>
                <path d="M20 32S3 22 3 11A9 9 0 0 1 20 8 9 9 0 0 1 37 11C37 22 20 32 20 32Z"/>
              </svg>
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: RESULT_TITLE_FONT, color: 'white', lineHeight: 1.3,
          }}>
            Tu Evaluación Oficial de<br/>
            <span style={{ color: '#f27db8' }}>Vibración Emocional™</span>
            <br/>está lista.
          </h1>
        </div>

        {/* Intro text */}
        <p className="anim-fade-up delay-300" style={{ color: 'rgba(255,255,255,0.58)', fontSize: RESULT_BODY_FONT, textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
          Tus respuestas muestran que hoy existen áreas emocionales con gran potencial de fortalecimiento.
          También identificamos algunos patrones que podrían estar influyendo en tu confianza, tu paz interior y tu apertura al amor.
        </p>

        {/* Bars */}
        <div className="glass-dark anim-fade-up delay-400" style={{ width: '90%', margin: '0 auto 20px', borderRadius: 24, padding: 20 }}>
          {dims.map(d => <DimensionBar key={d.key} {...d} />)}
        </div>

        {/* Personalized text */}
        <div className="glass-dark anim-fade-up delay-500" style={{ borderRadius: 24, padding: 16, marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: RESULT_BODY_FONT, lineHeight: 1.6, textAlign: 'center' }}>
            {personalizedText}
          </p>
        </div>

        {/* Isabella card */}
        <div className="anim-fade-up delay-600" style={{
          width: '100%', maxWidth: '100%', borderRadius: 24, overflow: 'hidden', marginBottom: 24,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            height: 140,
            backgroundImage: "url('https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=600')",
            backgroundSize: 'cover', backgroundPosition: 'center top',
          }} />
          <div style={{ padding: 16 }}>
            <p style={{ color: 'white', fontWeight: 600, fontSize: RESULT_BODY_FONT, marginBottom: 2 }}>Isabella Morales</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: RESULT_BODY_FONT, marginBottom: 12 }}>Especialista en bienestar emocional femenino</p>
            <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: RESULT_BODY_FONT, fontStyle: 'italic', marginBottom: 6 }}>
              "Lo más importante no son estos porcentajes..."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: RESULT_BODY_FONT, lineHeight: 1.6, marginBottom: 6 }}>
              Lo verdaderamente importante es comprender por qué obtuviste este resultado y cómo puedes fortalecer estas áreas de forma sencilla, dedicando solo unos minutos al día.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: RESULT_BODY_FONT }}>
              En el siguiente video voy a explicarte cómo funciona este proceso.
            </p>
          </div>
        </div>

        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: '12px 20px calc(env(safe-area-inset-bottom, 0px) + 12px)',
          background: 'linear-gradient(180deg,rgba(45,21,51,0),rgba(45,21,51,0.96) 22%,#2d1533 100%)',
        }}>
          <CTAButton onClick={onContinue} pulse>
            Ver mi explicación personalizada
          </CTAButton>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.28)', fontSize: RESULT_BODY_FONT, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 12, height: 12 }}>
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm1 9.5H7v-5h2v5zm0-6H7V6h2v-1.5z"/>
            </svg>
            El video comenzará automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}
