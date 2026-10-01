import type { ActiveSession, WorkoutHistoryEntry } from '../types';
import { WORKOUT_DAYS } from '../data/workouts';

const ACTIVE_SESSION_KEY = 'gymp_active_session';
const HISTORY_KEY = 'gymp_history';

// ─── Active Session ───────────────────────────────────────────────────────────

export function saveActiveSession(session: ActiveSession | null): void {
  if (session === null) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } else {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  }
}

export function loadActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveSession;
  } catch {
    return null;
  }
}

// ─── History ──────────────────────────────────────────────────────────────────

export function loadHistory(): WorkoutHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WorkoutHistoryEntry[];
  } catch {
    return [];
  }
}

export function appendHistory(entry: WorkoutHistoryEntry): void {
  const history = loadHistory();
  history.unshift(entry); // newest first
  // keep last 50 entries
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

// ─── Derive total sets per day ────────────────────────────────────────────────

export function getTotalSetsForDay(dayId: string): number {
  const day = WORKOUT_DAYS.find((d) => d.id === dayId);
  if (!day) return 0;
  return day.supersets.reduce(
    (sum, ss) => sum + ss.exercises.reduce((s2, ex) => s2 + ex.sets.length, 0),
    0
  );
}
