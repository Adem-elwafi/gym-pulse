import { useState, useEffect, useRef, useCallback, memo } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dumbbell,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { WORKOUT_DAYS } from '../data/workouts';
import { SetRow } from './SetRow';
import { ExerciseImage } from './ExerciseImage';
import type { ActiveSession, SessionStats, ExerciseSet } from '../types';

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

interface WorkoutScreenProps {
  session: ActiveSession;
  stats: SessionStats;
  onUpdateSet: (setId: string, updates: Partial<ExerciseSet>) => void;
  onCompleteSet: (setId: string, restTarget: number) => void;
  onUncompleteSet: (setId: string) => void;
  onFinish: () => void;
  onDiscard: () => void;
  onBack: () => void;
  timerActive: boolean;
}

export const WorkoutScreen = memo(function WorkoutScreen({
  session,
  stats,
  onUpdateSet,
  onCompleteSet,
  onUncompleteSet,
  onFinish,
  onDiscard,
  onBack,
  timerActive,
}: WorkoutScreenProps) {
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const day = WORKOUT_DAYS.find((d) => d.id === session.dayId);
  if (!day) return null;

  const totalSets = Object.keys(session.sets).length;
  const progressPct = totalSets > 0 ? (stats.completedSets / totalSets) * 100 : 0;

  return (
    <div className={timerActive ? 'min-h-screen bg-gray-950 pb-48' : 'min-h-screen bg-gray-950 pb-24'}>
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 pt-safe">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 flex items-center justify-center transition-all flex-shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Day {day.day}</p>
            <h2 className="text-lg font-bold tracking-tight text-white truncate">{day.title}</h2>
          </div>
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 active:scale-95 text-white text-xs font-bold transition-all"
          >
            Finish
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-0 px-4 pb-3 overflow-x-auto scrollbar-none">
          <ElapsedTimeChip startedAt={session.startedAt} />
          <div className="w-px h-8 bg-gray-800 mx-3 flex-shrink-0" />
          <StatChip icon={<CheckCircle2 className="w-3.5 h-3.5" />} value={`${stats.completedSets}/${totalSets}`} label="Sets" />
          <div className="w-px h-8 bg-gray-800 mx-3 flex-shrink-0" />
          <StatChip icon={<TrendingUp className="w-3.5 h-3.5" />} value={`${stats.totalVolume.toFixed(0)}kg`} label="Volume" />
        </div>

        {/* Progress bar */}
        <div
          className="h-0.5 bg-gray-800"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Workout progress"
        >
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Superset sections */}
      <div className="px-4 pt-4 space-y-8">
        {day.supersets.map((ss) => (
          <section key={ss.id}>
            {/* Superset header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold tracking-tight text-white">{ss.label}</h3>
                <p className="text-xs text-gray-400">Rest target: {ss.restTarget}s</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs">
                <Dumbbell className="w-3 h-3 inline mr-1" />
                {ss.exercises.length} exercises
              </span>
            </div>

            {/* Exercises */}
            <div className="space-y-6">
              {ss.exercises.map((ex, exIdx) => {
                const allSetsForEx = ex.sets.map((s) => session.sets[s.id] ?? s);
                const completedCount = allSetsForEx.filter((s) => s.completed).length;
                const allDone = completedCount === allSetsForEx.length;

                return (
                  <div
                    key={ex.id}
                    className={`rounded-2xl border transition-colors overflow-hidden ${
                      allDone
                        ? 'border-green-800/40 bg-green-950/10'
                        : 'border-gray-800 bg-gray-900/40'
                    }`}
                  >
                    {/* Exercise image + header row */}
                    <div className="flex gap-3 p-3">
                      {/* Image thumbnail */}
                      <ExerciseImage
                        exerciseName={ex.name}
                        className="w-24 h-20 flex-shrink-0"
                      />

                      {/* Title block */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            {ss.exercises.length > 1 && (
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-900/60 border border-violet-700/50 text-violet-400 text-[10px] font-bold flex items-center justify-center">
                                {String.fromCharCode(65 + exIdx)}
                              </span>
                            )}
                            <h4
                              className={`text-sm font-bold leading-tight ${
                                allDone ? 'text-green-400' : 'text-gray-100'
                              }`}
                            >
                              {ex.name}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-400">
                            {allSetsForEx.length} sets · {ex.targetReps} reps
                          </p>
                        </div>

                        {/* Mini progress dots */}
                        <div className="flex gap-1 mt-2">
                          {allSetsForEx.map((s, i) => (
                            <span
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                s.completed ? 'bg-green-500' : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {allDone && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 self-start mt-0.5" />
                      )}
                    </div>

                    {/* Sets */}
                    <div className="px-3 pb-3 space-y-2">
                      {allSetsForEx.map((s) => (
                        <WorkoutSetRow
                          key={s.id}
                          set={s}
                          restTarget={ss.restTarget}
                          onUpdateSet={onUpdateSet}
                          onCompleteSet={onCompleteSet}
                          onUncompleteSet={onUncompleteSet}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider between supersets */}
            <div className="mt-6 border-t border-gray-800/60" />
          </section>
        ))}

        {/* Discard button */}
        <button
          onClick={() => setShowDiscardConfirm(true)}
          className="w-full py-3 rounded-xl border border-red-800/60 text-red-400 hover:bg-red-900/20 active:bg-red-900/30 font-semibold text-sm transition-colors"
        >
          Discard Workout
        </button>
      </div>

      {/* Finish confirm dialog */}
      {showFinishConfirm && (
        <ConfirmDialog
          title="Finish Workout?"
          message={`You've completed ${stats.completedSets} of ${totalSets} sets and lifted ${stats.totalVolume.toFixed(0)} kg total.`}
          confirmLabel="Save & Finish"
          confirmClass="bg-green-600 hover:bg-green-500 text-white"
          onConfirm={() => { setShowFinishConfirm(false); onFinish(); }}
          onCancel={() => setShowFinishConfirm(false)}
        />
      )}

      {/* Discard confirm dialog */}
      {showDiscardConfirm && (
        <ConfirmDialog
          title="Discard Workout?"
          message="This will delete all progress for the current session. This cannot be undone."
          confirmLabel="Discard"
          confirmClass="bg-red-600 hover:bg-red-500 text-white"
          onConfirm={() => { setShowDiscardConfirm(false); onDiscard(); }}
          onCancel={() => setShowDiscardConfirm(false)}
          icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
        />
      )}
    </div>
  );
});

// ─── Sub-components ───────────────────────────────────────────────────────────

interface WorkoutSetRowProps {
  set: ExerciseSet;
  restTarget: number;
  onUpdateSet: (setId: string, updates: Partial<ExerciseSet>) => void;
  onCompleteSet: (setId: string, restTarget: number) => void;
  onUncompleteSet: (setId: string) => void;
}

const WorkoutSetRow = memo(function WorkoutSetRow({
  set,
  restTarget,
  onUpdateSet,
  onCompleteSet,
  onUncompleteSet,
}: WorkoutSetRowProps) {
  const handleChange = useCallback(
    (updates: Partial<ExerciseSet>) => {
      onUpdateSet(set.id, updates);
    },
    [onUpdateSet, set.id]
  );

  const handleComplete = useCallback(() => {
    onCompleteSet(set.id, restTarget);
  }, [onCompleteSet, set.id, restTarget]);

  const handleUncomplete = useCallback(() => {
    onUncompleteSet(set.id);
  }, [onUncompleteSet, set.id]);

  return (
    <SetRow
      set={set}
      onChange={handleChange}
      onComplete={handleComplete}
      onUncomplete={handleUncomplete}
    />
  );
});

function ElapsedTimeChip({ startedAt }: { startedAt: number }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <StatChip
      icon={<Clock className="w-3.5 h-3.5" />}
      value={formatDuration(elapsedSeconds)}
      label="Time"
    />
  );
}

function StatChip({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="text-violet-400">{icon}</span>
      <div>
        <p className="text-sm font-bold text-white leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ title, message, confirmLabel, confirmClass, icon, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl">
        {icon && <div className="mb-3">{icon}</div>}
        <h3 id="confirm-dialog-title" className="text-lg font-bold text-white mb-2">{title}</h3>
        <p id="confirm-dialog-desc" className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
