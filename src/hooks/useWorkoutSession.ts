import { useState, useCallback, useEffect, useRef } from 'react';
import { WORKOUT_DAYS } from '../data/workouts';
import { v4 as uuid } from '../data/uuid';
import {
  saveActiveSession,
  loadActiveSession,
  appendHistory,
  getTotalSetsForDay,
} from '../lib/storage';
import type { ActiveSession, ExerciseSet, SessionStats, WorkoutHistoryEntry } from '../types';

export function useWorkoutSession() {
  const [session, setSession] = useState<ActiveSession | null>(() => loadActiveSession());
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Elapsed timer
  useEffect(() => {
    if (!session) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsed(0);
      return;
    }
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - session.startedAt) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, [session?.startedAt]);

  // Persist on every change
  useEffect(() => {
    saveActiveSession(session);
  }, [session]);

  const startSession = useCallback((dayId: string) => {
    const day = WORKOUT_DAYS.find((d) => d.id === dayId);
    if (!day) return;

    // Build initial set map from preloaded data
    const sets: Record<string, ExerciseSet> = {};
    day.supersets.forEach((ss) => {
      ss.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          sets[s.id] = { ...s };
        });
      });
    });

    setSession({ dayId, startedAt: Date.now(), sets });
  }, []);

  const updateSet = useCallback(
    (setId: string, updates: Partial<ExerciseSet>) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sets: {
            ...prev.sets,
            [setId]: { ...prev.sets[setId], ...updates },
          },
        };
      });
    },
    []
  );

  const completeSet = useCallback(
    (setId: string) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sets: {
            ...prev.sets,
            [setId]: { ...prev.sets[setId], completed: true, completedAt: Date.now() },
          },
        };
      });
    },
    []
  );

  const uncompleteSet = useCallback(
    (setId: string) => {
      setSession((prev) => {
        if (!prev) return prev;
        const updated = { ...prev.sets[setId], completed: false, completedAt: undefined };
        return { ...prev, sets: { ...prev.sets, [setId]: updated } };
      });
    },
    []
  );

  const finishSession = useCallback(() => {
    if (!session) return;
    const day = WORKOUT_DAYS.find((d) => d.id === session.dayId);
    const completedSets = Object.values(session.sets).filter((s) => s.completed);
    const totalVolume = completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0);

    const entry: WorkoutHistoryEntry = {
      id: uuid(),
      dayId: session.dayId,
      dayTitle: day?.title ?? 'Workout',
      startedAt: session.startedAt,
      finishedAt: Date.now(),
      totalVolume,
      completedSets: completedSets.length,
      totalSets: getTotalSetsForDay(session.dayId),
    };
    appendHistory(entry);
    setSession(null);
  }, [session]);

  const discardSession = useCallback(() => {
    setSession(null);
  }, []);

  // Derive stats
  const stats: SessionStats | null = session
    ? (() => {
        const completed = Object.values(session.sets).filter((s) => s.completed);
        return {
          totalVolume: completed.reduce((sum, s) => sum + s.weight * s.reps, 0),
          completedSets: completed.length,
          elapsedSeconds: elapsed,
        };
      })()
    : null;

  return {
    session,
    stats,
    startSession,
    updateSet,
    completeSet,
    uncompleteSet,
    finishSession,
    discardSession,
  };
}
