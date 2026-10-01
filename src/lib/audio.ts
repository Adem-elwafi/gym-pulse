/** Play a short beep using the Web Audio API */
export function playBeep(frequency = 880, duration = 0.15, volume = 0.4): void {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // silently fail – Web Audio not available
  }
}

/** Play a 3-beep "timer done" pattern */
export function playTimerDone(): void {
  playBeep(880, 0.1, 0.5);
  setTimeout(() => playBeep(880, 0.1, 0.5), 160);
  setTimeout(() => playBeep(1100, 0.25, 0.6), 320);
}
