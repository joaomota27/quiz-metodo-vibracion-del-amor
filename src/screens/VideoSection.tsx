import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { VSL_VIDEO_URL } from '../constants';
import CTAButton from '../components/CTAButton';
import SoundToggle from '../components/SoundToggle';
import { trackEvent } from '../tracking';

interface Props {
  onContinue: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function VideoSection({ onContinue, soundEnabled, onSoundToggle }: Props) {
  const [showCTA, setShowCTA] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const playerRef = useRef<any>(null);
  const milestonesRef = useRef<Set<number>>(new Set());

  // ViewVSL on mount
  useEffect(() => {
    trackEvent('ViewVSL', undefined, true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), 8000);
    return () => clearTimeout(t);
  }, []);

  // Load YouTube IFrame API and track progress
  function startVideo() {
    setVideoStarted(true);
    trackEvent('VSLPlay', undefined, true);

    // Load YT API if not loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    // Wait for API ready, then create player
    const tryCreate = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        createPlayer();
      } else {
        setTimeout(tryCreate, 200);
      }
    };
    setTimeout(tryCreate, 300);
  }

  function createPlayer() {
    const videoId = extractYouTubeId(VSL_VIDEO_URL);
    if (!videoId) return;

    playerRef.current = new (window as any).YT.Player('vsl-yt-player', {
      videoId,
      events: {
        onReady: (e: any) => e.target.playVideo(),
        onStateChange: (e: any) => {
          // Poll progress when playing
          if (e.data === 1) {
            startProgressPolling();
          }
        },
      },
    });
  }

  function startProgressPolling() {
    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p || !p.getCurrentTime || !p.getDuration) return;
      const cur = p.getCurrentTime();
      const dur = p.getDuration();
      if (!dur) return;
      const pct = (cur / dur) * 100;
      checkMilestone(pct, 25, 'VSL25');
      checkMilestone(pct, 50, 'VSL50');
      checkMilestone(pct, 75, 'VSL75');
      checkMilestone(pct, 95, 'VSL95');
      if (pct >= 95) clearInterval(interval);
    }, 1000);
  }

  function checkMilestone(pct: number, threshold: number, eventName: string) {
    if (pct >= threshold && !milestonesRef.current.has(threshold)) {
      milestonesRef.current.add(threshold);
      trackEvent(eventName, undefined, true);
    }
  }

  function extractYouTubeId(url: string): string | null {
    const m = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  return (
    <div className="anim-fade-in" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg,#1a0c1f 0%,#2d1533 60%,#fdf4f8 100%)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 20px 12px' }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Explicación Personalizada
          </p>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 16, color: 'white', lineHeight: 1.35 }}>
            Tu explicación personalizada con Isabella Morales
          </h1>
        </div>
        <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} dark />
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.6 }}>
          Mira este breve video para entender cómo funciona el Método Vibración del Amor™ y cómo puedes comenzar tu experiencia de 30 días.
        </p>
      </div>

      {/* Video */}
      <div style={{ margin: '0 20px 20px' }}>
        <div style={{
          borderRadius: 24, overflow: 'hidden',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 40px rgba(232,83,156,0.15)',
        }}>
          {!videoStarted ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: "url('https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=600')",
                backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,12,31,0.5)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <button
                  onClick={startVideo}
                  style={{
                    width: 64, height: 64, borderRadius: '50%', cursor: 'pointer', border: 'none',
                    background: 'linear-gradient(135deg,#e8539c,#f27db8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(232,83,156,0.5)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <Play size={24} fill="white" style={{ color: 'white', marginLeft: 3 }} />
                </button>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>Presiona para ver el video</p>
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
              <div id="vsl-yt-player" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </div>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ flex: 1, padding: '0 20px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 12 }}>
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
