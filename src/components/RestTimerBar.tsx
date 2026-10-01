import { Pause, Play, SkipForward, Volume2, VolumeX, Plus } from 'lucide-react';
import type { RestTimerState, RestTimerPreset } from '../types';

const PRESETS: RestTimerPreset[] = [45, 60, 75, 90, 120];

interface RestTimerBarProps {
  timerState: RestTimerState;
  soundEnabled: boolean;
  flashActive: boolean;
  setSoundEnabled: (v: boolean) => void;
  onPause: () => void;
  onSkip: () => void;
  onAddTime: (seconds: number) => void;
  onChangePreset: (preset: RestTimerPreset) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function RestTimerBar({
  timerState,
  soundEnabled,
  flashActive,
  setSoundEnabled,
  onPause,
  onSkip,
  onAddTime,
  onChangePreset,
}: RestTimerBarProps) {
  if (!timerState.active) return null;

  const progress = timerState.duration > 0
    ? ((timerState.duration - timerState.remaining) / timerState.duration) * 100
    : 0;

  const urgency = timerState.remaining <= 10;

  return (
    <>
      {/* Screen flash overlay */}
      {flashActive && (
        <div className="fixed inset-0 bg-green-400/20 pointer-events-none z-[100] animate-pulse" />
      )}

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
        {/* Progress bar */}
        <div className="h-1 bg-gray-800 w-full">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${urgency ? 'bg-red-500' : 'bg-violet-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`bg-gray-900 border-t border-gray-800 px-4 pt-3 pb-safe ${urgency ? 'border-t-red-500/30' : ''}`}>
          {/* Top row: timer + controls */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Rest Timer</p>
                <p className={`text-3xl font-black tabular-nums leading-none ${urgency ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {formatTime(timerState.remaining)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* +30s */}
              <button
                onClick={() => onAddTime(30)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 text-gray-300 text-xs font-semibold transition-all"
              >
                <Plus className="w-3 h-3" />30s
              </button>

              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 flex items-center justify-center transition-all"
                aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-gray-300" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {/* Pause/Resume */}
              <button
                onClick={onPause}
                className="w-10 h-10 rounded-xl bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center transition-all"
                aria-label={timerState.paused ? 'Resume timer' : 'Pause timer'}
              >
                {timerState.paused ? (
                  <Play className="w-4 h-4 text-white" />
                ) : (
                  <Pause className="w-4 h-4 text-white" />
                )}
              </button>

              {/* Skip */}
              <button
                onClick={onSkip}
                className="w-10 h-10 rounded-xl bg-violet-700 hover:bg-violet-600 active:scale-95 flex items-center justify-center transition-all"
                aria-label="Skip rest timer"
              >
                <SkipForward className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Preset chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => onChangePreset(preset)}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                  timerState.duration === preset
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {preset}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
