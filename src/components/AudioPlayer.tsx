import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import React from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  coverColor?: string;
  coverIcon?: React.ReactNode;
}

interface Props {
  track: AudioTrack;
  onEnded?: () => void;
  dark?: boolean;
}

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ track, onEnded, dark = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const seekingRef = useRef(false);

  // Load new track
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setReady(false);
    setCurrent(0);
    setDuration(0);
    setPlaying(false);
    a.load();
  }, [track.src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    function onLoaded() {
      setDuration(a!.duration || 0);
      setReady(true);
    }
    function onTime() {
      if (!seekingRef.current) setCurrent(a!.currentTime);
    }
    function onEnd() {
      setPlaying(false);
      setCurrent(0);
      onEnded?.();
    }
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('durationchange', onLoaded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('durationchange', onLoaded);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnd);
    };
  }, [onEnded]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a || !ready) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, ready]);

  function handleSeek(e: React.MouseEvent | React.TouchEvent) {
    const a = audioRef.current;
    const el = trackRef.current;
    if (!a || !el || !duration) return;
    const rect = el.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    a.currentTime = newTime;
    setCurrent(newTime);
  }

  function startSeek(e: React.MouseEvent | React.TouchEvent) {
    seekingRef.current = true;
    handleSeek(e);
  }
  function endSeek() {
    seekingRef.current = false;
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0;
  const coverColor = track.coverColor ?? 'linear-gradient(135deg,#e8539c,#f27db8)';
  const textColor = dark ? 'white' : '#1f2937';
  const subColor = dark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const playBg = dark ? 'linear-gradient(135deg,#e8539c,#f27db8)' : 'linear-gradient(135deg,#e8539c,#f27db8)';

  return (
    <div className="audio-player" style={{ color: textColor }}>
      <audio ref={audioRef} src={track.src} preload="auto" playsInline webkit-playsinline="true" x-webkit-airplay="deny" />

      {/* Top row: cover + info + play */}
      <div className="audio-player-top">
        <div className="audio-player-cover" style={{ background: coverColor }}>
          {track.coverIcon ?? (
            <svg viewBox="0 0 24 22" fill="white" style={{ width: 24, height: 24, opacity: 0.9 }}>
              <path d="M12 20S2 13.5 2 7A5.5 5.5 0 0 1 12 5 5.5 5.5 0 0 1 22 7C22 13.5 12 20 12 20Z"/>
            </svg>
          )}
        </div>

        <div className="audio-player-info">
          <p className="audio-player-title" style={{ color: textColor }}>{track.title}</p>
          <p className="audio-player-sub" style={{ color: subColor }}>{track.subtitle}</p>
        </div>

        <button
          className="audio-player-play"
          onClick={toggle}
          disabled={!ready}
          style={{
            background: playBg,
            opacity: ready ? 1 : 0.5,
            boxShadow: '0 2px 12px rgba(232,83,156,0.4)',
          }}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? <Pause size={18} fill="white" style={{ color: 'white' }} /> : <Play size={18} fill="white" style={{ color: 'white', marginLeft: 2 }} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="audio-player-progress-row">
        <span className="audio-player-time" style={{ color: subColor }}>{formatTime(current)}</span>
        <div
          ref={trackRef}
          className="audio-player-track"
          onMouseDown={startSeek}
          onTouchStart={startSeek}
          onTouchMove={handleSeek}
          onTouchEnd={endSeek}
          onMouseUp={endSeek}
          onMouseLeave={endSeek}
        >
          <div
            className="audio-player-track-fill"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg,#e8539c,#f27db8)',
            }}
          >
            <div className="audio-player-track-thumb" style={{ right: 0 }} />
          </div>
        </div>
        <span className="audio-player-time" style={{ color: subColor }}>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
