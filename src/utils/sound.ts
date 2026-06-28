let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.08,
  fadeIn = 0.01,
  fadeOut = 0.1
): void {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + fadeIn);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration - fadeOut);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // silent fail
  }
}

function playChord(frequencies: number[], duration: number, gainValue = 0.05): void {
  frequencies.forEach((freq, i) => {
    setTimeout(() => playTone(freq, duration, 'sine', gainValue, 0.02, 0.15), i * 30);
  });
}

export function playClickSound(): void {
  playTone(880, 0.1, 'sine', 0.06, 0.005, 0.08);
}

export function playSelectSound(): void {
  playChord([523.25, 659.25, 783.99], 0.4, 0.05);
}

export function playTransitionSound(): void {
  playChord([392, 523.25, 659.25], 0.6, 0.06);
  setTimeout(() => playTone(783.99, 0.5, 'sine', 0.05, 0.01, 0.2), 150);
}

export function playCompleteSound(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.5, 'sine', 0.07, 0.01, 0.3), i * 100);
  });
}

export function playResultSound(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.8, 'sine', 0.06, 0.01, 0.4), i * 80);
  });
  setTimeout(() => playChord([523.25, 659.25, 783.99, 1046.5], 1.5, 0.04), 500);
}

export function playParticleSound(): void {
  playTone(1200 + Math.random() * 400, 0.15, 'sine', 0.03, 0.01, 0.1);
}

export function playAmbientTick(): void {
  playTone(440, 0.08, 'sine', 0.02, 0.005, 0.06);
}

export function unlockAudio(): void {
  const ctx = getCtx();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // iOS Safari silent buffer trick — primes the audio pipeline on first gesture
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    src.disconnect();
  } catch {}
}

export function vibrateShort(): void {
  if (navigator.vibrate) {
    navigator.vibrate(15);
  }
}

export function vibrateMedium(): void {
  if (navigator.vibrate) {
    navigator.vibrate([20, 10, 20]);
  }
}

export function vibrateSpecial(): void {
  if (navigator.vibrate) {
    navigator.vibrate([30, 15, 30, 15, 60]);
  }
}
