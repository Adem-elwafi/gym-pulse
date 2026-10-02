import { useState, memo } from 'react';
import { Check, RotateCcw, Minus, Plus } from 'lucide-react';
import type { ExerciseSet } from '../types';

interface SetRowProps {
  set: ExerciseSet;
  onChange: (updates: Partial<ExerciseSet>) => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

export const SetRow = memo(function SetRow({ set, onChange, onComplete, onUncomplete }: SetRowProps) {
  const [editWeight, setEditWeight] = useState(false);
  const [weightDraft, setWeightDraft] = useState('');
  const [editReps, setEditReps] = useState(false);
  const [repsDraft, setRepsDraft] = useState('');

  const startEditWeight = () => {
    setWeightDraft(String(set.weight));
    setEditWeight(true);
  };

  const commitWeight = () => {
    const trimmed = weightDraft.trim();
    if (trimmed === '') {
      onChange({ weight: 0 });
    } else {
      const parsed = parseFloat(trimmed);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange({ weight: parseFloat(parsed.toFixed(1)) });
      }
    }
    setEditWeight(false);
  };

  const startEditReps = () => {
    setRepsDraft(String(set.reps));
    setEditReps(true);
  };

  const commitReps = () => {
    const trimmed = repsDraft.trim();
    if (trimmed === '') {
      onChange({ reps: 0 });
    } else {
      const parsed = parseInt(trimmed, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange({ reps: Math.max(0, parsed) });
      }
    }
    setEditReps(false);
  };

  const adjustWeight = (delta: number) => {
    const current = editWeight ? (parseFloat(weightDraft) || set.weight) : set.weight;
    const nextWeight = Math.max(0, parseFloat((current + delta).toFixed(1)));
    if (editWeight) {
      setWeightDraft(String(nextWeight));
    }
    onChange({ weight: nextWeight });
  };

  const adjustReps = (delta: number) => {
    const current = editReps ? (parseInt(repsDraft, 10) || set.reps) : set.reps;
    const nextReps = Math.max(0, current + delta);
    if (editReps) {
      setRepsDraft(String(nextReps));
    }
    onChange({ reps: nextReps });
  };

  if (set.completed) {
    return (
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 py-2 px-2.5 sm:px-3 rounded-xl bg-gray-800/50 border border-green-800/40">
        <span className="w-5 sm:w-6 text-center text-xs font-bold text-green-500 tabular-nums flex-shrink-0">
          #{set.setNumber}
        </span>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
          <span className="font-semibold text-green-400 tabular-nums">{set.weight} kg</span>
          <span className="text-gray-400">×</span>
          <span className="font-semibold text-green-400 tabular-nums">{set.reps} reps</span>
          <span className="ml-auto text-[11px] sm:text-xs text-gray-400 tabular-nums truncate">
            {(set.weight * set.reps).toFixed(0)} kg vol
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
          <button
            type="button"
            onClick={onUncomplete}
            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-500 active:scale-95 flex items-center justify-center transition-all text-gray-300 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
            aria-label={`Undo set ${set.setNumber}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 py-2 px-2 sm:px-3 rounded-xl bg-gray-800/60 border border-gray-700">
      {/* Set number */}
      <span className="w-5 sm:w-6 text-center text-xs font-bold text-gray-400 tabular-nums flex-shrink-0">
        #{set.setNumber}
      </span>

      {/* Middle controls: Weight & Reps */}
      <div className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2">
        {/* Weight control */}
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => adjustWeight(-2.5)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
            aria-label="Decrease weight by 2.5 kg"
          >
            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
          </button>

          {editWeight ? (
            <input
              type="number"
              inputMode="decimal"
              value={weightDraft}
              onChange={(e) => setWeightDraft(e.target.value)}
              onBlur={commitWeight}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitWeight();
                if (e.key === 'Escape') setEditWeight(false);
              }}
              autoFocus
              className="w-12 sm:w-14 h-7 sm:h-8 text-center bg-gray-900 border border-violet-500 rounded-lg text-white font-bold text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              step="any"
              min="0"
              aria-label={`Weight for set ${set.setNumber} in kg`}
            />
          ) : (
            <button
              type="button"
              onClick={startEditWeight}
              className="w-12 sm:w-14 h-7 sm:h-8 flex items-center justify-center text-center font-bold text-white text-sm rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors tabular-nums focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
              aria-label={`Weight: ${set.weight} kg – tap to edit`}
            >
              <span>{set.weight}</span>
              <span className="text-gray-400 text-[10px] sm:text-xs font-normal ml-0.5">kg</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => adjustWeight(2.5)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
            aria-label="Increase weight by 2.5 kg"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
          </button>
        </div>

        {/* × separator */}
        <span className="text-gray-400 text-xs sm:text-sm font-bold flex-shrink-0">×</span>

        {/* Reps control */}
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => adjustReps(-1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
            aria-label="Decrease reps by 1"
          >
            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
          </button>

          {editReps ? (
            <input
              type="number"
              inputMode="numeric"
              value={repsDraft}
              onChange={(e) => setRepsDraft(e.target.value)}
              onBlur={commitReps}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitReps();
                if (e.key === 'Escape') setEditReps(false);
              }}
              autoFocus
              className="w-10 sm:w-12 h-7 sm:h-8 text-center bg-gray-900 border border-violet-500 rounded-lg text-white font-bold text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              min="0"
              aria-label={`Reps for set ${set.setNumber}`}
            />
          ) : (
            <button
              type="button"
              onClick={startEditReps}
              className="w-10 sm:w-12 h-7 sm:h-8 flex items-center justify-center text-center font-bold text-white text-sm rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors tabular-nums focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
              aria-label={`Reps: ${set.reps} – tap to edit`}
            >
              <span>{set.reps}</span>
              <span className="text-gray-400 text-[10px] sm:text-xs font-normal ml-0.5">r</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => adjustReps(1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
            aria-label="Increase reps by 1"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Complete button - Guaranteed inside box with flex-shrink-0 */}
      <button
        type="button"
        onClick={onComplete}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all shadow-md shadow-violet-900/40 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none ml-1"
        aria-label={`Complete set ${set.setNumber}`}
      >
        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
      </button>
    </div>
  );
});
