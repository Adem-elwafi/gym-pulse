import { Dumbbell, Clock, ChevronRight } from 'lucide-react';
import { WORKOUT_DAYS } from '../data/workouts';
import type { WorkoutDay } from '../types';

interface DayCardProps {
  day: WorkoutDay;
  isActive: boolean;
  onStart: (dayId: string) => void;
  onResume: () => void;
}

function DayCard({ day, isActive, onStart, onResume }: DayCardProps) {
  const totalSets = day.supersets.reduce(
    (sum, ss) => sum + ss.exercises.reduce((s2, ex) => s2 + ex.sets.length, 0),
    0
  );
  const totalExercises = day.supersets.reduce((sum, ss) => sum + ss.exercises.length, 0);

  const dayColors: Record<number, string> = {
    1: 'from-violet-600 to-purple-700',
    2: 'from-cyan-600 to-blue-700',
    3: 'from-orange-500 to-red-600',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
      {/* Gradient accent strip */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${dayColors[day.day]}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
              Day {day.day}
            </p>
            <h3 className="text-lg font-bold text-white leading-tight">{day.title}</h3>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>{day.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4" />
            {totalExercises} exercises
          </span>
          <span>{totalSets} sets total</span>
          <span>{day.supersets.length} supersets</span>
        </div>

        {/* Superset preview */}
        <div className="space-y-1.5 mb-5">
          {day.supersets.map((ss) => (
            <div key={ss.id} className="flex items-center gap-2 text-xs text-gray-400 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 flex-shrink-0" />
              <span className="min-w-0 truncate">
                {ss.label}: {ss.exercises.map((e) => e.name).join(' + ')}
              </span>
            </div>
          ))}
        </div>

        {isActive ? (
          <button
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.98] text-black font-bold text-base flex items-center justify-center gap-2 transition-all"
          >
            Resume Workout
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onStart(day.id)}
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${dayColors[day.day]} hover:opacity-90 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2 transition-all`}
          >
            Start Day {day.day}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

interface HomeScreenProps {
  activeDayId: string | null;
  onStart: (dayId: string) => void;
  onResume: () => void;
  onViewHistory: () => void;
  timerActive?: boolean;
}

export function HomeScreen({
  activeDayId,
  onStart,
  onResume,
  onViewHistory,
  timerActive = false,
}: HomeScreenProps) {
  return (
    <div className={`min-h-screen bg-gray-950 px-4 pt-6 ${timerActive ? 'pb-48' : 'pb-24'}`}>
      {/* Header */}
      <div className="mb-8 pt-safe">
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell className="w-7 h-7 text-violet-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">GymPulse</h1>
        </div>
        <p className="text-gray-400 text-sm">3-Day Express Superset Program</p>
      </div>

      {/* Active session banner */}
      {activeDayId && (
        <button
          type="button"
          onClick={onResume}
          className="w-full text-left mb-6 p-4 rounded-2xl bg-green-900/40 border border-green-700/50 flex items-center justify-between cursor-pointer active:opacity-80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        >
          <div>
            <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-0.5">Active Workout</p>
            <p className="text-white font-bold">
              {WORKOUT_DAYS.find((d) => d.id === activeDayId)?.title ?? 'Workout'} in progress
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-green-400 flex-shrink-0" />
        </button>
      )}

      {/* Day cards */}
      <div className="space-y-4 mb-6">
        {WORKOUT_DAYS.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            isActive={day.id === activeDayId}
            onStart={onStart}
            onResume={onResume}
          />
        ))}
      </div>

      {/* History link */}
      <button
        onClick={onViewHistory}
        className="w-full py-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 font-semibold text-sm transition-colors active:scale-[0.98]"
      >
        View Workout History
      </button>
    </div>
  );
}
