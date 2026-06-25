import { Shield } from 'lucide-react';
import CTAButton from '../components/CTAButton';
import SoundToggle from '../components/SoundToggle';

interface BeforeStartScreenProps {
  onContinue: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function BeforeStartScreen({ onContinue, soundEnabled, onSoundToggle }: BeforeStartScreenProps) {
  return (
    <div className="anim-fade-in" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg,#fff0f5 0%,#fce8f3 40%,#fdf9f0 100%)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
        <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 24px 32px' }}>
        {/* Heart illustration */}
        <div className="anim-scale-in delay-200" style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg,#fce8f3,#fbd1e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 80 72" className="anim-heartbeat" style={{ width: 44, height: 44 }}>
              <defs>
                <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f27db8"/>
                  <stop offset="100%" stopColor="#e8539c"/>
                </linearGradient>
              </defs>
              <path d="M40 64S6 44 6 22A16 16 0 0 1 40 16 16 16 0 0 1 74 22C74 44 40 64 40 64Z" fill="url(#hg1)"/>
            </svg>
          </div>
          <div className="ripple-ring" />
          <div className="ripple-ring ripple-ring-2" />
        </div>

        <h1 className="anim-fade-up delay-300" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 24, color: '#1f2937', textAlign: 'center', marginBottom: 24,
        }}>
          Antes de comenzar...
        </h1>

        <div className="glass-card anim-fade-up delay-400" style={{ borderRadius: 24, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', width: '100%', maxWidth: 360, marginBottom: 32 }}>
          {[
            'No existen respuestas correctas o incorrectas.',
            'Lo importante es tu sinceridad.',
            'Tus respuestas son confidenciales y estarán 100% protegidas.',
            'Responde con sinceridad. Así podremos generar un resultado mucho más personalizado para ti.',
          ].map((text, i) => (
            <div key={i}>
              <p style={{ fontSize: 13, color: i === 1 ? '#374151' : '#6b7280', lineHeight: 1.6, textAlign: 'center', fontWeight: i === 1 ? 500 : 400 }}>
                {text}
              </p>
              {i < 3 && <div style={{ height: 1, background: '#fce8f3', margin: '12px 0' }} />}
            </div>
          ))}
        </div>

        <div className="anim-fade-up delay-500" style={{ width: '100%', maxWidth: 360 }}>
          <CTAButton onClick={onContinue}>Estoy lista</CTAButton>
        </div>

        <div className="anim-fade-in delay-600" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
          <Shield size={12} style={{ color: '#f27db8' }} />
          <span style={{ fontSize: 11, color: '#f27db8' }}>Evaluación 100% privada y segura</span>
        </div>
      </div>
    </div>
  );
}
