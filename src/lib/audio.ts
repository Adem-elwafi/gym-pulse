let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/** Play a short beep using the lazy singleton AudioContext */
export function playBeep(frequency = 880, duration = 0.15, volume = 0.4): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch {
    // silently fail – Web Audio not available
  }
}

/** Play a 3-beep chime using scheduled Web Audio offsets on the shared AudioContext */
export function playTimerDone(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const beeps = [
      { freq: 880, startOffset: 0, duration: 0.1, volume: 0.5 },
      { freq: 880, startOffset: 0.16, duration: 0.1, volume: 0.5 },
      { freq: 1100, startOffset: 0.32, duration: 0.25, volume: 0.6 },
    ];

    const now = ctx.currentTime;

    beeps.forEach(({ freq, startOffset, duration, volume }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + startOffset;
      const stopTime = startTime + duration;

      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);

      oscillator.start(startTime);
      oscillator.stop(stopTime);
    });
  } catch {
    // silently fail
  }
}
