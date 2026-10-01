import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { EXERCISE_IMAGES } from '../data/exerciseImages';

interface ExerciseImageProps {
  exerciseName: string;
  /** Extra Tailwind classes for the wrapper */
  className?: string;
}

/**
 * Lazy-loads the two exercise frames from free-exercise-db.
 * - Shows a skeleton while loading
 * - Falls back to a styled placeholder icon if the image 404s
 * - Toggles between start/end frame on tap (shows movement)
 */
export function ExerciseImage({ exerciseName, className = '' }: ExerciseImageProps) {
  const frames = EXERCISE_IMAGES[exerciseName];
  const [frameIdx, setFrameIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const src = frames?.[frameIdx] ?? null;
  const hasSecondFrame = frames?.[1] !== undefined;

  const handleClick = () => {
    if (hasSecondFrame && loaded && !errored) {
      setFrameIdx((i) => (i === 0 ? 1 : 0));
      setLoaded(false); // show skeleton while next frame loads
    }
  };

  // No mapping → fallback placeholder
  if (!src || errored) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700/40 ${className}`}
      >
        <Dumbbell className="w-8 h-8 text-gray-600 mb-1" />
        <span className="text-[10px] text-gray-600 text-center px-2 leading-tight">
          {exerciseName}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-800 ${className} ${hasSecondFrame ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      title={hasSecondFrame ? 'Tap to see end position' : exerciseName}
    >
      {/* Skeleton shimmer while image loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <Dumbbell className="w-8 h-8 text-gray-700" />
        </div>
      )}

      <img
        src={src}
        alt={exerciseName}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover object-top transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Frame indicator dots */}
      {hasSecondFrame && loaded && (
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === frameIdx ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* "Tap" hint on first render */}
      {hasSecondFrame && loaded && frameIdx === 0 && (
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/50 text-white text-[9px] font-semibold">
          tap
        </div>
      )}
    </div>
  );
}
