import { useEffect, useState } from 'react';
import CTAButton from '../components/CTAButton';
import SoundToggle from '../components/SoundToggle';
import { trackEvent } from '../tracking';

interface Props {
  onContinue: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const VTURB_SCRIPT_ID = 'vturb-vsl-player';
const VTURB_SCRIPT_SRC = 'https://scripts.converteai.net/93cbf256-ee81-4707-9e7a-3c42b66a315a/players/6a44756079ce81d83fc3a246/v4/player.js';

export default function VideoSection({ onContinue, soundEnabled, onSoundToggle }: Props) {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    trackEvent('ViewVSL', undefined, true);

    if (!document.getElementById(VTURB_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = VTURB_SCRIPT_ID;
      script.src = VTURB_SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }

    const timer = window.setTimeout(() => setShowCTA(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="vsl-page"
      style={{
        minHeight: '100dvh',
        overflowX: 'hidden',
        background: 'linear-gradient(180deg,#1a0c1f 0%,#2d1533 60%,#fdf4f8 100%)',
      }}
    >
      <style>
        {`
          .vsl-page,
          .vsl-page * {
            max-width: 100%;
            box-sizing: border-box;
          }
        `}
      </style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 20px 12px' }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Explicacion Personalizada
          </p>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 16, color: 'white', lineHeight: 1.35 }}>
            Tu explicacion personalizada con Isabella Morales
          </h1>
        </div>
        <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} dark />
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.6 }}>
          Mira este breve video para entender como funciona el Metodo Vibracion del Amor y como puedes comenzar tu experiencia de 30 dias.
        </p>
      </div>

      <div style={{ margin: '0 20px 20px' }}>
        <div
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 40px rgba(232,83,156,0.15)',
          }}
        >
          {/*
            VTurb injects the video player from the external script loaded above.
            Keep this markup aligned with the ConverteAI embed.
          */}
          {(
            <vturb-smartplayer id="vid-6a44756079ce81d83fc3a246" style={{ display: 'block', margin: '0 auto', width: '100%' }}>
              <div
                className="vturb-player-placeholder"
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '75% 0 0',
                  zIndex: 0,
                  backgroundColor: 'black',
                }}
              />
            </vturb-smartplayer>
          ) as JSX.Element}
        </div>
      </div>

      <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!showCTA && (
          <CTAButton variant="secondary" onClick={onContinue}>
            Continuar
          </CTAButton>
        )}
        {showCTA && (
          <div className="anim-fade-up">
            <CTAButton onClick={onContinue} pulse showArrow>
              Quiero comenzar mi experiencia
            </CTAButton>
          </div>
        )}
      </div>
    </div>
  );
}
