import type { ActiveSession, WorkoutHistoryEntry } from '../types';
import { WORKOUT_DAYS } from '../data/workouts';

const ACTIVE_SESSION_KEY = 'gymp_active_session';
const HISTORY_KEY = 'gymp_history';
const SETTINGS_KEY = 'gymp_settings';

export interface UserSettings {
  soundEnabled: boolean;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundEnabled: true };
    const parsed = JSON.parse(raw);
    return {
      soundEnabled: typeof parsed?.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
    };
  } catch {
    return { soundEnabled: true };
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // QuotaExceededError or private browsing
  }
}

// ─── Active Session ───────────────────────────────────────────────────────────

export function saveActiveSession(session: ActiveSession | null): void {
  try {
    if (session === null) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } else {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // QuotaExceededError or private browsing
  }
}

export function loadActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.dayId === 'string' &&
      typeof parsed.startedAt === 'number' &&
      parsed.sets &&
      typeof parsed.sets === 'object' &&
      !Array.isArray(parsed.sets)
    ) {
      return parsed as ActiveSession;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── History ──────────────────────────────────────────────────────────────────

export function loadHistory(): WorkoutHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WorkoutHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendHistory(entry: WorkoutHistoryEntry): void {
  try {
    const history = loadHistory();
    history.unshift(entry); // newest first
    // keep last 50 entries
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    // QuotaExceededError or private browsing
  }
}

export function exportHistoryJSON(): string {
  const history = loadHistory();
  return JSON.stringify(history, null, 2);
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // safely ignore
  }
}

export function deleteHistoryEntry(id: string): void {
  try {
    const history = loadHistory().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // QuotaExceededError or private browsing
  }
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
