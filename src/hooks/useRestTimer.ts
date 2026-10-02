import { useState, useEffect, useCallback, useRef } from 'react';
import type { RestTimerState, RestTimerPreset } from '../types';
import { playTimerDone } from '../lib/audio';
import { loadSettings, saveSettings } from '../lib/storage';

const DEFAULT_STATE: RestTimerState = {
  active: false,
  paused: false,
  remaining: 0,
  duration: 0,
};

export function useRestTimer() {
  const [state, setState] = useState<RestTimerState>(DEFAULT_STATE);
  const [soundEnabled, setSoundEnabledState] = useState(() => loadSettings().soundEnabled);
  const [flashActive, setFlashActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const setSoundEnabled = useCallback((enabledOrFn: boolean | ((prev: boolean) => boolean)) => {
    setSoundEnabledState((prev) => {
      const next = typeof enabledOrFn === 'function' ? enabledOrFn(prev) : enabledOrFn;
      saveSettings({ soundEnabled: next });
      return next;
    });
  }, []);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateRemaining = useCallback(() => {
    if (endTimeRef.current === null) return;
    const diff = Math.ceil((endTimeRef.current - Date.now()) / 1000);
    if (diff <= 0) {
      endTimeRef.current = null;
      setState((prev) => ({ ...prev, remaining: 0, active: false }));
    } else {
      setState((prev) => (prev.remaining === diff ? prev : { ...prev, remaining: diff }));
    }
  }, []);

  // Tick every 250ms when active & not paused to guarantee accurate display
  useEffect(() => {
    if (!state.active || state.paused) {
      clearInterval_();
      return;
    }

    intervalRef.current = window.setInterval(updateRemaining, 250);

    return clearInterval_;
  }, [state.active, state.paused, clearInterval_, updateRemaining]);

  // Recalculate immediately when tab returns to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && state.active && !state.paused) {
        updateRemaining();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.active, state.paused, updateRemaining]);

  // Sound + vibration + flash when timer hits 0
  const prevActive = useRef(state.active);
  useEffect(() => {
    if (prevActive.current && !state.active && state.remaining === 0 && state.duration > 0) {
      if (soundEnabled) {
        playTimerDone();
      }
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([250, 100, 250, 100, 400]);
      }
      // flash screen
      setFlashActive(true);
      const timer = window.setTimeout(() => setFlashActive(false), 600);
      return () => clearTimeout(timer);
    }
    prevActive.current = state.active;
  }, [state.active, state.remaining, state.duration, soundEnabled]);

  const start = useCallback((seconds: number) => {
    clearInterval_();
    endTimeRef.current = Date.now() + seconds * 1000;
    setState({ active: true, paused: false, remaining: seconds, duration: seconds });
  }, [clearInterval_]);

  const pause = useCallback(() => {
    setState((prev) => {
      if (!prev.active) return prev;
      if (prev.paused) {
        // Unpausing: recalculate targetEndTime
        endTimeRef.current = Date.now() + prev.remaining * 1000;
        return { ...prev, paused: false };
      } else {
        // Pausing
        endTimeRef.current = null;
        return { ...prev, paused: true };
      }
    });
  }, []);

  const skip = useCallback(() => {
    clearInterval_();
    endTimeRef.current = null;
    setState(DEFAULT_STATE);
  }, [clearInterval_]);

  const addTime = useCallback((seconds: number) => {
    setState((prev) => {
      if (!prev.active) return prev;
      const nextRemaining = Math.min(prev.remaining + seconds, 599);
      const nextDuration = Math.max(prev.duration, nextRemaining);
      if (!prev.paused) {
        endTimeRef.current = Date.now() + nextRemaining * 1000;
      }
      return {
        ...prev,
        remaining: nextRemaining,
        duration: nextDuration,
      };
    });
  }, []);

  const changePreset = useCallback((preset: RestTimerPreset) => {
    clearInterval_();
    endTimeRef.current = Date.now() + preset * 1000;
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
