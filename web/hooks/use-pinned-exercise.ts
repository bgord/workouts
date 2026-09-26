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

  const available = workout.data.exercises.filter((exercise) => exercise.actions.setLog.available);
  const index = available.findIndex((exercise) => exercise.id === id);

  const pinned = available[index];
  const previous = pinned && available[index - 1];
  const next = pinned && available[index + 1];

  return { pinned, previous, next, pin: write, unpin: () => write(null) };
}
