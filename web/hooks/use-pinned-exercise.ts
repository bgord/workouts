import { useEffect, useState } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";

type PinnedExerciseId = WorkoutExercise["id"];

const key = "workout-pin";

const read = (): PinnedExerciseId | null => {
  try {
    return localStorage.getItem(key) as PinnedExerciseId | null;
  } catch {
    return null;
  }
};

const write = (id: PinnedExerciseId | null) => {
  try {
    if (id === null) localStorage.removeItem(key);
    else localStorage.setItem(key, id);
  } catch {}
};

export function usePinnedExercise() {
  const [id, setId] = useState<PinnedExerciseId | null>(null);

  useEffect(() => setId(read()), []);

  const pin = (next: PinnedExerciseId) => {
    write(next);
    setId(next);
  };

  const unpin = () => {
    write(null);
    setId(null);
  };

  const isPinned = (exercise: WorkoutExercise) => exercise.id === id && exercise.actions.setLog.available;

  return { id, pin, unpin, isPinned };
}

export type UsePinnedExerciseReturnType = ReturnType<typeof usePinnedExercise>;
