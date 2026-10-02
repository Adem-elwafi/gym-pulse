/**
 * Maps each exercise name to a photo from the free-exercise-db GitHub repo.
 * Raw CDN: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/
 *
 * Each entry is [image0, image1] — we show image0 as primary, image1 on tap/flip.
 * All folder paths are verified against https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json
 */

const BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

export const EXERCISE_IMAGES: Record<string, [string, string?]> = {
  // ── Day 1: Upper ──────────────────────────────────────────────────────────
  'Incline Dumbbell Press': [
    `${BASE}/Incline_Dumbbell_Press/0.jpg`,
    `${BASE}/Incline_Dumbbell_Press/1.jpg`,
  ],
  'Lat Pulldown / Pull-ups': [
    `${BASE}/Wide-Grip_Lat_Pulldown/0.jpg`,
    `${BASE}/Wide-Grip_Lat_Pulldown/1.jpg`,
  ],
  'Chest Press Machine / Dips': [
    `${BASE}/Dips_-_Chest_Version/0.jpg`,
    `${BASE}/Dips_-_Chest_Version/1.jpg`,
  ],
  'Chest-Supported Dumbbell Row': [
    `${BASE}/Dumbbell_Incline_Row/0.jpg`,
    `${BASE}/Dumbbell_Incline_Row/1.jpg`,
  ],
  'Dumbbell Lateral Raises': [
    `${BASE}/Side_Lateral_Raise/0.jpg`,
    `${BASE}/Side_Lateral_Raise/1.jpg`,
  ],
  'Cable Face Pulls': [
    `${BASE}/Face_Pull/0.jpg`,
    `${BASE}/Face_Pull/1.jpg`,
  ],

  // ── Day 2: Lower ──────────────────────────────────────────────────────────
  'Leg Press / Hack Squat': [
    `${BASE}/Leg_Press/0.jpg`,
    `${BASE}/Leg_Press/1.jpg`,
  ],
  'Dumbbell Romanian Deadlift (RDL)': [
    `${BASE}/Romanian_Deadlift/0.jpg`,
    `${BASE}/Romanian_Deadlift/1.jpg`,
  ],
  'Leg Extension': [
    `${BASE}/Leg_Extensions/0.jpg`,
    `${BASE}/Leg_Extensions/1.jpg`,
  ],
  'Lying Leg Curl': [
    `${BASE}/Lying_Leg_Curls/0.jpg`,
    `${BASE}/Lying_Leg_Curls/1.jpg`,
  ],
  'Standing Calf Raises': [
    `${BASE}/Standing_Calf_Raises/0.jpg`,
    `${BASE}/Standing_Calf_Raises/1.jpg`,
  ],

  // ── Day 3: Arms & Shoulders ──────────────────────────────────────────────
  'Incline Dumbbell Curl': [
    `${BASE}/Incline_Dumbbell_Curl/0.jpg`,
    `${BASE}/Incline_Dumbbell_Curl/1.jpg`,
  ],
  'Overhead Cable Triceps Extension': [
    `${BASE}/Cable_Rope_Overhead_Triceps_Extension/0.jpg`,
    `${BASE}/Cable_Rope_Overhead_Triceps_Extension/1.jpg`,
  ],
  'Hammer Curls': [
    `${BASE}/Hammer_Curls/0.jpg`,
    `${BASE}/Hammer_Curls/1.jpg`,
  ],
  'Cable Triceps Rope Pushdown': [
    `${BASE}/Triceps_Pushdown_-_Rope_Attachment/0.jpg`,
    `${BASE}/Triceps_Pushdown_-_Rope_Attachment/1.jpg`,
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
