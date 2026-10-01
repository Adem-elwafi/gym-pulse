// ─── Domain Types ────────────────────────────────────────────────────────────

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weight: number;       // kg
  reps: number;
  completed: boolean;
  completedAt?: number; // epoch ms
}

export interface Exercise {
  id: string;
  name: string;
  targetReps: string;   // e.g. "8-10" or "15"
  sets: ExerciseSet[];
}

export interface Superset {
  id: string;
  label: string;        // "Superset 1", "Finisher", etc.
  exercises: Exercise[];
  restTarget: number;   // seconds
}

export interface WorkoutDay {
  id: string;
  day: number;
  title: string;
  duration: string;     // e.g. "~32 min"
  supersets: Superset[];
}

// ─── Session Types ────────────────────────────────────────────────────────────

export interface ActiveSession {
  dayId: string;
  startedAt: number;    // epoch ms
  /** Map of exerciseSetId → ExerciseSet (mutated during workout) */
  sets: Record<string, ExerciseSet>;
}

export interface SessionStats {
  totalVolume: number;  // kg (sum of weight*reps for completed sets)
  completedSets: number;
  elapsedSeconds: number;
}

// ─── Rest Timer Types ─────────────────────────────────────────────────────────

export type RestTimerPreset = 45 | 60 | 75 | 90 | 120;

export interface RestTimerState {
  active: boolean;
  paused: boolean;
  remaining: number;    // seconds
  duration: number;     // total seconds for current countdown
}

// ─── History Types ────────────────────────────────────────────────────────────

export interface WorkoutHistoryEntry {
  id: string;
  dayId: string;
  dayTitle: string;
  startedAt: number;
  finishedAt: number;
  totalVolume: number;
  completedSets: number;
  totalSets: number;
}
