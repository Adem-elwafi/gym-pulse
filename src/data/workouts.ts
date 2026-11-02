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
  // ─── Day 1: Upper A (Pecs, Dos & Biceps - 80/20) ───────────────────────────
  {
    id: 'day-1',
    day: 1,
    title: 'Upper A (Pecs & Dos)',
    duration: '~30 min',
    supersets: [
      {
        id: 'day1-ss1',
        label: 'Superset 1 (Compound)',
        restTarget: 90,
        exercises: [
          makeExercise('day1-ss1-ex1', 'Incline Dumbbell Press', '6-8', 25, 3),
          makeExercise('day1-ss1-ex2', 'Chest-Supported Dumbbell Row', '8-10', 22.5, 3),
        ],
      },
      {
        id: 'day1-ss2',
        label: 'Superset 2 (Isolation)',
        restTarget: 60,
        exercises: [
          makeExercise('day1-ss2-ex1', 'Dumbbell Lateral Raises', '10-12', 10, 3),
          makeExercise('day1-ss2-ex2', 'Incline Dumbbell Curl', '8-10', 12.5, 3),
        ],
      },
    ],
  },

  // ─── Day 2: Lower A (Quads & Ischios Foot - 80/20) ─────────────────────────
  {
    id: 'day-2',
    day: 2,
    title: 'Lower A (Force & Ischios)',
    duration: '~28 min',
    supersets: [
      {
        id: 'day2-ss1',
        label: 'Superset 1 (Piliers Jambes)',
        restTarget: 90,
        exercises: [
          makeExercise('day2-ss1-ex1', 'Leg Press / Hack Squat', '8-10', 90, 3),
          makeExercise('day2-ss1-ex2', 'Dumbbell Romanian Deadlift (RDL)', '8-10', 32.5, 3),
        ],
      },
      {
        id: 'day2-ss2',
        label: 'Finisher Ischios',
        restTarget: 60,
        exercises: [
          makeExercise('day2-ss2-ex1', 'Lying Leg Curl', '10-12', 35, 3),
        ],
      },
    ],
  },

  // ─── Day 3: Upper B (Largeur Dos, Épaules & Triceps - 80/20) ───────────────
  {
    id: 'day-3',
    day: 3,
    title: 'Upper B (Dos & Épaules)',
    duration: '~30 min',
    supersets: [
      {
        id: 'day3-ss1',
        label: 'Superset 1 (Vertical Push/Pull)',
        restTarget: 90,
        exercises: [
          makeExercise('day3-ss1-ex1', 'Lat Pulldown / Pull-ups', '6-8', 55, 3),
          makeExercise('day3-ss1-ex2', 'Dumbbell Shoulder Press', '8-10', 17.5, 3),
        ],
      },
      {
        id: 'day3-ss2',
        label: 'Superset 2 (Postérieur & Triceps)',
        restTarget: 60,
        exercises: [
          makeExercise('day3-ss2-ex1', 'Cable Face Pulls', '12-15', 17.5, 3),
          makeExercise('day3-ss2-ex2', 'Overhead Cable Triceps Extension', '10-12', 17.5, 3),
        ],
      },
    ],
  },

  // ─── Day 4: Lower B & Core (Découpe & Abdos - 80/20) ───────────────────────
  {
    id: 'day-4',
    day: 4,
    title: 'Lower B & Core (Abdos & Jambes)',
    duration: '~28 min',
    supersets: [
      {
        id: 'day4-ss1',
        label: 'Superset 1 (Isolation Cuisses)',
        restTarget: 60,
        exercises: [
          makeExercise('day4-ss1-ex1', 'Leg Extension', '10-12', 45, 3),
          makeExercise('day4-ss1-ex2', 'Lying Leg Curl', '8-10', 40, 3),
        ],
      },
      {
        id: 'day4-ss2',
        label: 'Superset 2 (Mollets & Abdos)',
        restTarget: 45,
        exercises: [
          makeExercise('day4-ss2-ex1', 'Standing Calf Raises', '12-15', 60, 3),
          makeExercise('day4-ss2-ex2', 'Hanging Leg Raises', '10-15', 0, 3),
        ],
      },
    ],
  },
];
