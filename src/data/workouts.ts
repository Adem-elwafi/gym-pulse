import { v4 as uuid } from './uuid';
import type { WorkoutDay } from '../types';

function makeSet(setNumber: number, weight: number, reps: number) {
  return {
    id: uuid(),
    setNumber,
    weight,
    reps,
    completed: false,
  };
}

function makeExercise(name: string, targetReps: string, defaultWeight: number, numSets: number) {
  return {
    id: uuid(),
    name,
    targetReps,
    sets: Array.from({ length: numSets }, (_, i) =>
      makeSet(i + 1, defaultWeight, parseInt(targetReps.split('-')[0], 10))
    ),
  };
}

export const WORKOUT_DAYS: WorkoutDay[] = [
  // ─── Day 1: Upper SuperSet ─────────────────────────────────────────────────
  {
    id: 'day-1',
    day: 1,
    title: 'Upper SuperSet',
    duration: '~32 min',
    supersets: [
      {
        id: 'day1-ss1',
        label: 'Superset 1',
        restTarget: 90,
        exercises: [
          makeExercise('Incline Dumbbell Press', '8-10', 22.5, 3),
          makeExercise('Lat Pulldown / Pull-ups', '8-10', 50, 3),
        ],
      },
      {
        id: 'day1-ss2',
        label: 'Superset 2',
        restTarget: 75,
        exercises: [
          makeExercise('Chest Press Machine / Dips', '8-10', 40, 3),
          makeExercise('Chest-Supported Dumbbell Row', '8-10', 20, 3),
        ],
      },
      {
        id: 'day1-ss3',
        label: 'Superset 3',
        restTarget: 60,
        exercises: [
          makeExercise('Dumbbell Lateral Raises', '12-15', 10, 3),
          makeExercise('Cable Face Pulls', '15', 15, 3),
        ],
      },
    ],
  },

  // ─── Day 2: Lower SuperSet ─────────────────────────────────────────────────
  {
    id: 'day-2',
    day: 2,
    title: 'Lower SuperSet',
    duration: '~30 min',
    supersets: [
      {
        id: 'day2-ss1',
        label: 'Superset 1',
        restTarget: 90,
        exercises: [
          makeExercise('Leg Press / Hack Squat', '8-10', 80, 3),
          makeExercise('Dumbbell Romanian Deadlift (RDL)', '8-10', 30, 3),
        ],
      },
      {
        id: 'day2-ss2',
        label: 'Superset 2',
        restTarget: 60,
        exercises: [
          makeExercise('Leg Extension', '10-12', 40, 3),
          makeExercise('Lying Leg Curl', '10-12', 35, 3),
        ],
      },
      {
        id: 'day2-finisher',
        label: 'Finisher',
        restTarget: 45,
        exercises: [
          makeExercise('Standing Calf Raises', '15', 60, 3),
        ],
      },
    ],
  },

  // ─── Day 3: Arms & Shoulders SuperSet ────────────────────────────────────
  {
    id: 'day-3',
    day: 3,
    title: 'Arms & Shoulders SuperSet',
    duration: '~30 min',
    supersets: [
      {
        id: 'day3-ss1',
        label: 'Superset 1',
        restTarget: 75,
        exercises: [
          makeExercise('Incline Dumbbell Curl', '8-10', 12.5, 3),
          makeExercise('Overhead Cable Triceps Extension', '10-12', 15, 3),
        ],
      },
      {
        id: 'day3-ss2',
        label: 'Superset 2',
        restTarget: 60,
        exercises: [
          makeExercise('Hammer Curls', '10-12', 14, 3),
          makeExercise('Cable Triceps Rope Pushdown', '10-12', 20, 3),
        ],
      },
      {
        id: 'day3-ss3',
        label: 'Superset 3',
        restTarget: 60,
        exercises: [
          makeExercise('Dumbbell Shoulder Press', '10', 17.5, 3),
          makeExercise('Hanging Leg Raises', '12-15', 0, 3),
        ],
      },
    ],
  },
];
