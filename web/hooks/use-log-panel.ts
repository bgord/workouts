import { useSyncExternalStore } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { workoutRoute } from "../router";

type ExerciseId = WorkoutExercise["id"];

const key = "workout-log-panel";

const read = (): ExerciseId | null => {
  try {
    return localStorage.getItem(key) as ExerciseId | null;
    /* v8 ignore next 2 */
  } catch {
    return null;
  }
};

let current = read();

const listeners = new Set<VoidFunction>();

const subscribe = (listener: VoidFunction) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const snapshot = () => current;

const write = (id: ExerciseId | null) => {
  current = id;

  try {
    if (id === null) localStorage.removeItem(key);
    else localStorage.setItem(key, id);
    /* v8 ignore next */
  } catch {}

  for (const listener of listeners) listener();
};

export function useLogPanel() {
  const { workout } = workoutRoute.useLoaderData();
  const id = useSyncExternalStore(subscribe, snapshot, () => null);

  const available = workout.data.exercises.filter((exercise) => exercise.actions.setLog.available);
  const index = available.findIndex((exercise) => exercise.id === id);

  const active = available[index];

  return {
    active,
    available,
    position: index + 1,
    open: write,
    close: () => write(null),
  };
}
