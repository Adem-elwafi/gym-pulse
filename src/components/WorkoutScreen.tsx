import { useState } from 'react';
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
import type { ReactNode } from 'react';

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

export function WorkoutScreen({
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
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 flex items-center justify-center transition-all flex-shrink-0"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-gray-300" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Day {day.day}</p>
            <h2 className="text-base font-bold text-white truncate">{day.title}</h2>
          </div>
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 active:scale-95 text-white text-xs font-bold transition-all"
          >
            Finish
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-0 px-4 pb-3 overflow-x-auto">
          <StatChip icon={<Clock className="w-3.5 h-3.5" />} value={formatDuration(stats.elapsedSeconds)} label="Time" />
          <div className="w-px h-8 bg-gray-800 mx-3" />
          <StatChip icon={<CheckCircle2 className="w-3.5 h-3.5" />} value={`${stats.completedSets}/${totalSets}`} label="Sets" />
          <div className="w-px h-8 bg-gray-800 mx-3" />
          <StatChip icon={<TrendingUp className="w-3.5 h-3.5" />} value={`${stats.totalVolume.toFixed(0)}kg`} label="Volume" />
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-800">
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
                <h3 className="text-sm font-bold text-white">{ss.label}</h3>
                <p className="text-xs text-gray-500">Rest target: {ss.restTarget}s</p>
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
                          <p className="text-xs text-gray-500">
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
                        <SetRow
                          key={s.id}
                          set={s}
                          onChange={(updates) => onUpdateSet(s.id, updates)}
                          onComplete={() => onCompleteSet(s.id, ss.restTarget)}
                          onUncomplete={() => onUncompleteSet(s.id)}
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
          className="w-full py-3 rounded-xl border border-red-900/50 text-red-500 hover:bg-red-900/10 active:bg-red-900/20 font-semibold text-sm transition-colors"
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
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatChip({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <span className="text-violet-400">{icon}</span>
      <div>
        <p className="text-sm font-bold text-white leading-none">{value}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
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
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl">
        {icon && <div className="mb-3">{icon}</div>}
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm transition-colors"
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
