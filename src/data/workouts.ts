import type { WorkoutDay } from '../types';

function makeSet(id: string, setNumber: number, weight: number, reps: number) {
  return {
    id,
    setNumber,
    weight,
    reps,
    completed: false,
  };
}

function makeExercise(id: string, name: string, targetReps: string, defaultWeight: number, numSets: number) {
  return {
    id,
    name,
    targetReps,
    sets: Array.from({ length: numSets }, (_, i) =>
      makeSet(`${id}-s${i + 1}`, i + 1, defaultWeight, parseInt(targetReps.split('-')[0], 10))
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
          makeExercise('day1-ss1-ex1', 'Incline Dumbbell Press', '8-10', 22.5, 3),
          makeExercise('day1-ss1-ex2', 'Lat Pulldown / Pull-ups', '8-10', 50, 3),
        ],
      },
      {
        id: 'day1-ss2',
        label: 'Superset 2',
        restTarget: 75,
        exercises: [
          makeExercise('day1-ss2-ex1', 'Chest Press Machine / Dips', '8-10', 40, 3),
          makeExercise('day1-ss2-ex2', 'Chest-Supported Dumbbell Row', '8-10', 20, 3),
        ],
      },
      {
        id: 'day1-ss3',
        label: 'Superset 3',
        restTarget: 60,
        exercises: [
          makeExercise('day1-ss3-ex1', 'Dumbbell Lateral Raises', '12-15', 10, 3),
          makeExercise('day1-ss3-ex2', 'Cable Face Pulls', '15', 15, 3),
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
          makeExercise('day2-ss1-ex1', 'Leg Press / Hack Squat', '8-10', 80, 3),
          makeExercise('day2-ss1-ex2', 'Dumbbell Romanian Deadlift (RDL)', '8-10', 30, 3),
        ],
      },
      {
        id: 'day2-ss2',
        label: 'Superset 2',
        restTarget: 60,
        exercises: [
          makeExercise('day2-ss2-ex1', 'Leg Extension', '10-12', 40, 3),
          makeExercise('day2-ss2-ex2', 'Lying Leg Curl', '10-12', 35, 3),
        ],
      },
      {
        id: 'day2-finisher',
        label: 'Finisher',
        restTarget: 45,
        exercises: [
          makeExercise('day2-finisher-ex1', 'Standing Calf Raises', '15', 60, 3),
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
          makeExercise('day3-ss1-ex1', 'Incline Dumbbell Curl', '8-10', 12.5, 3),
          makeExercise('day3-ss1-ex2', 'Overhead Cable Triceps Extension', '10-12', 15, 3),
        ],
      },
      {
        id: 'day3-ss2',
        label: 'Superset 2',
        restTarget: 60,
        exercises: [
          makeExercise('day3-ss2-ex1', 'Hammer Curls', '10-12', 14, 3),
          makeExercise('day3-ss2-ex2', 'Cable Triceps Rope Pushdown', '10-12', 20, 3),
        ],
      },
      {
        id: 'day3-ss3',
        label: 'Superset 3',
        restTarget: 60,
        exercises: [
          makeExercise('day3-ss3-ex1', 'Dumbbell Shoulder Press', '10', 17.5, 3),
          makeExercise('day3-ss3-ex2', 'Hanging Leg Raises', '12-15', 0, 3),
        ],
      },
    ],
  },
];
