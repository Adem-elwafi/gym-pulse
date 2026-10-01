import { useState, useEffect, useCallback, useRef } from 'react';
import type { RestTimerState, RestTimerPreset } from '../types';
import { playTimerDone } from '../lib/audio';

const DEFAULT_STATE: RestTimerState = {
  active: false,
  paused: false,
  remaining: 0,
  duration: 0,
};

export function useRestTimer() {
  const [state, setState] = useState<RestTimerState>(DEFAULT_STATE);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [flashActive, setFlashActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Tick every second when active & not paused
  useEffect(() => {
    if (!state.active || state.paused) {
      clearInterval_();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setState((prev) => {
        if (!prev.active || prev.paused) return prev;
        const next = prev.remaining - 1;
        if (next <= 0) {
          // Timer done
          return { ...prev, remaining: 0, active: false };
        }
        return { ...prev, remaining: next };
      });
    }, 1000);

    return clearInterval_;
  }, [state.active, state.paused, clearInterval_]);

  // Sound + flash when timer hits 0
  const prevActive = useRef(state.active);
  useEffect(() => {
    if (prevActive.current && !state.active && state.remaining === 0) {
      if (soundEnabled) playTimerDone();
      // flash screen
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 600);
    }
    prevActive.current = state.active;
  }, [state.active, state.remaining, soundEnabled]);

  const start = useCallback((seconds: number) => {
    clearInterval_();
    setState({ active: true, paused: false, remaining: seconds, duration: seconds });
  }, [clearInterval_]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  const skip = useCallback(() => {
    clearInterval_();
    setState(DEFAULT_STATE);
  }, [clearInterval_]);

  const addTime = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      remaining: Math.min(prev.remaining + seconds, 599),
      duration: Math.max(prev.duration, prev.remaining + seconds),
    }));
  }, []);

  const changePreset = useCallback((preset: RestTimerPreset) => {
    clearInterval_();
    setState({ active: true, paused: false, remaining: preset, duration: preset });
  }, [clearInterval_]);

  return {
    timerState: state,
    soundEnabled,
    setSoundEnabled,
    flashActive,
    start,
    pause,
    skip,
    addTime,
    changePreset,
  };
}
