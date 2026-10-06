import { useSyncExternalStore } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { workoutRoute } from "../router";

type ExerciseId = WorkoutExercise["id"];

let current: ExerciseId | null = null;

const listeners = new Set<VoidFunction>();

const subscribe = (listener: VoidFunction) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const snapshot = () => current;

const write = (id: ExerciseId | null) => {
  current = id;

  for (const listener of listeners) listener();
};

export function useLogPanel() {
  const { workout } = workoutRoute.useLoaderData();
  const id = useSyncExternalStore(subscribe, snapshot, () => null);

  const available = workout.data.exercises.filter((exercise) => exercise.actions.setLog.available);
  const index = available.findIndex((exercise) => exercise.id === id);

  const active = available[index];
  const previous = active && available[index - 1];
  const next = active && available[index + 1];

  return { active, previous, next, open: write, close: () => write(null) };
}
