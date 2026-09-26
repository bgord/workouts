import { useSyncExternalStore } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { workoutRoute } from "../router";

type PinnedExerciseId = WorkoutExercise["id"];

const key = "workout-pin";

let current: PinnedExerciseId | null | undefined;

const listeners = new Set<VoidFunction>();

const subscribe = (listener: VoidFunction) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const read = (): PinnedExerciseId | null => {
  try {
    return localStorage.getItem(key) as PinnedExerciseId | null;
  } catch {
    return null;
  }
};

const snapshot = () => {
  if (current === undefined) current = read();
  return current;
};

const write = (id: PinnedExerciseId | null) => {
  current = id;

  try {
    if (id === null) localStorage.removeItem(key);
    else localStorage.setItem(key, id);
  } catch {}

  for (const listener of listeners) listener();
};

export function usePinnedExercise() {
  const { workout } = workoutRoute.useLoaderData();
  const id = useSyncExternalStore(subscribe, snapshot, () => null);

  const pinned = workout.data.exercises.find(
    (exercise) => exercise.id === id && exercise.actions.setLog.available,
  );

  return { pinned, pin: write, unpin: () => write(null) };
}
