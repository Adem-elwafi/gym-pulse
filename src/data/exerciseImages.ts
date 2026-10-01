/**
 * Maps each exercise name to a photo from the free-exercise-db GitHub repo.
 * Raw CDN: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/
 *
 * Each entry is [image0, image1] — we show image0 as primary, image1 on hover/flip.
 */

const BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export const EXERCISE_IMAGES: Record<string, [string, string?]> = {
  // ── Day 1: Upper ──────────────────────────────────────────────────────────
  'Incline Dumbbell Press': [
    `${BASE}/Dumbbell_Incline_Bench_Press/0.jpg`,
    `${BASE}/Dumbbell_Incline_Bench_Press/1.jpg`,
  ],
  'Lat Pulldown / Pull-ups': [
    `${BASE}/Pulldown/0.jpg`,
    `${BASE}/Pulldown/1.jpg`,
  ],
  'Chest Press Machine / Dips': [
    `${BASE}/Chest_Dip/0.jpg`,
    `${BASE}/Chest_Dip/1.jpg`,
  ],
  'Chest-Supported Dumbbell Row': [
    `${BASE}/Bent_Over_Two-Dumbbell_Row/0.jpg`,
    `${BASE}/Bent_Over_Two-Dumbbell_Row/1.jpg`,
  ],
  'Dumbbell Lateral Raises': [
    `${BASE}/Dumbbell_Lateral_Raise/0.jpg`,
    `${BASE}/Dumbbell_Lateral_Raise/1.jpg`,
  ],
  'Cable Face Pulls': [
    `${BASE}/Cable_Rear_Delt_Row/0.jpg`,
    `${BASE}/Cable_Rear_Delt_Row/1.jpg`,
  ],

  // ── Day 2: Lower ──────────────────────────────────────────────────────────
  'Leg Press / Hack Squat': [
    `${BASE}/Leg_Press/0.jpg`,
    `${BASE}/Leg_Press/1.jpg`,
  ],
  'Dumbbell Romanian Deadlift (RDL)': [
    `${BASE}/Dumbbell_Romanian_Deadlift/0.jpg`,
    `${BASE}/Dumbbell_Romanian_Deadlift/1.jpg`,
  ],
  'Leg Extension': [
    `${BASE}/Leg_Extension/0.jpg`,
    `${BASE}/Leg_Extension/1.jpg`,
  ],
  'Lying Leg Curl': [
    `${BASE}/Lying_Leg_Curl/0.jpg`,
    `${BASE}/Lying_Leg_Curl/1.jpg`,
  ],
  'Standing Calf Raises': [
    `${BASE}/Standing_Calf_Raise/0.jpg`,
    `${BASE}/Standing_Calf_Raise/1.jpg`,
  ],

  // ── Day 3: Arms & Shoulders ──────────────────────────────────────────────
  'Incline Dumbbell Curl': [
    `${BASE}/Dumbbell_Incline_Curl/0.jpg`,
    `${BASE}/Dumbbell_Incline_Curl/1.jpg`,
  ],
  'Overhead Cable Triceps Extension': [
    `${BASE}/Cable_Overhead_Triceps_Extension/0.jpg`,
    `${BASE}/Cable_Overhead_Triceps_Extension/1.jpg`,
  ],
  'Hammer Curls': [
    `${BASE}/Dumbbell_Alternate_Hammer_Curl/0.jpg`,
    `${BASE}/Dumbbell_Alternate_Hammer_Curl/1.jpg`,
  ],
  'Cable Triceps Rope Pushdown': [
    `${BASE}/Triceps_Pushdown/0.jpg`,
    `${BASE}/Triceps_Pushdown/1.jpg`,
  ],
  'Dumbbell Shoulder Press': [
    `${BASE}/Dumbbell_Shoulder_Press/0.jpg`,
    `${BASE}/Dumbbell_Shoulder_Press/1.jpg`,
  ],
  'Hanging Leg Raises': [
    `${BASE}/Hanging_Leg_Raise/0.jpg`,
    `${BASE}/Hanging_Leg_Raise/1.jpg`,
  ],
};
