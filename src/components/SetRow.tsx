import { useState } from 'react';
import { Check, RotateCcw, Minus, Plus } from 'lucide-react';
import type { ExerciseSet } from '../types';

interface SetRowProps {
  set: ExerciseSet;
  onChange: (updates: Partial<ExerciseSet>) => void;
  onComplete: () => void;
  onUncomplete: () => void;
}

export function SetRow({ set, onChange, onComplete, onUncomplete }: SetRowProps) {
  const [editWeight, setEditWeight] = useState(false);
  const [editReps, setEditReps] = useState(false);

  const adjustWeight = (delta: number) => {
    onChange({ weight: Math.max(0, parseFloat((set.weight + delta).toFixed(1))) });
  };

  const adjustReps = (delta: number) => {
    onChange({ reps: Math.max(0, set.reps + delta) });
  };

  if (set.completed) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-gray-800/50 border border-green-800/40">
        <span className="w-7 text-center text-xs font-bold text-green-500">#{set.setNumber}</span>
        <div className="flex-1 flex items-center gap-2 text-sm text-gray-400">
          <span className="font-semibold text-green-400">{set.weight} kg</span>
          <span>×</span>
          <span className="font-semibold text-green-400">{set.reps} reps</span>
          <span className="ml-auto text-xs text-gray-600">
            {(set.weight * set.reps).toFixed(0)} kg vol
          </span>
        </div>
        <button
          onClick={onUncomplete}
          className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-700 transition-colors text-gray-400"
          aria-label="Undo set"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-black" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-3 px-3 rounded-xl bg-gray-800/60 border border-gray-700">
      {/* Set number */}
      <span className="w-6 text-center text-xs font-bold text-gray-500 flex-shrink-0">
        #{set.setNumber}
      </span>

      {/* Weight control */}
      <div className="flex items-center gap-1 flex-1">
        <button
          onPointerDown={() => adjustWeight(-2.5)}
          className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all"
          aria-label="Decrease weight by 2.5 kg"
        >
          <Minus className="w-3.5 h-3.5 text-gray-300" />
        </button>

        {editWeight ? (
          <input
            type="number"
            value={set.weight}
            onChange={(e) => onChange({ weight: Math.max(0, parseFloat(e.target.value) || 0) })}
            onBlur={() => setEditWeight(false)}
            autoFocus
            className="w-16 text-center bg-gray-900 border border-violet-500 rounded-lg py-1 text-white font-bold text-sm focus:outline-none"
            step="0.5"
            min="0"
          />
        ) : (
          <button
            onClick={() => setEditWeight(true)}
            className="w-16 text-center font-bold text-white text-sm py-1 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
            aria-label={`Weight: ${set.weight} kg – tap to edit`}
          >
            {set.weight}
            <span className="text-gray-500 text-xs font-normal ml-0.5">kg</span>
          </button>
        )}

        <button
          onPointerDown={() => adjustWeight(2.5)}
          className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all"
          aria-label="Increase weight by 2.5 kg"
        >
          <Plus className="w-3.5 h-3.5 text-gray-300" />
        </button>
      </div>

      {/* × separator */}
      <span className="text-gray-600 text-sm font-bold flex-shrink-0">×</span>

      {/* Reps control */}
      <div className="flex items-center gap-1 flex-1">
        <button
          onPointerDown={() => adjustReps(-1)}
          className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all"
          aria-label="Decrease reps by 1"
        >
          <Minus className="w-3.5 h-3.5 text-gray-300" />
        </button>

        {editReps ? (
          <input
            type="number"
            value={set.reps}
            onChange={(e) => onChange({ reps: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            onBlur={() => setEditReps(false)}
            autoFocus
            className="w-12 text-center bg-gray-900 border border-violet-500 rounded-lg py-1 text-white font-bold text-sm focus:outline-none"
            min="0"
          />
        ) : (
          <button
            onClick={() => setEditReps(true)}
            className="w-12 text-center font-bold text-white text-sm py-1 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
            aria-label={`Reps: ${set.reps} – tap to edit`}
          >
            {set.reps}
            <span className="text-gray-500 text-xs font-normal ml-0.5">r</span>
          </button>
        )}

        <button
          onPointerDown={() => adjustReps(1)}
          className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all"
          aria-label="Increase reps by 1"
        >
          <Plus className="w-3.5 h-3.5 text-gray-300" />
        </button>
      </div>

      {/* Complete button */}
      <button
        onClick={onComplete}
        className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 flex items-center justify-center flex-shrink-0 transition-all shadow-lg shadow-violet-900/40"
        aria-label="Complete set"
      >
        <Check className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
