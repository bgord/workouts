import { useOptimistic } from "react";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";

export function useOptimisticSet(source: WorkoutExercise) {
  const [optimisticSet, setPendingSet] = useOptimistic<LoggedSet | null>(null);

  const pendingSet =
    optimisticSet && source.loggedSets.length < optimisticSet.setNumber ? optimisticSet : null;
  const exercise = pendingSet ? { ...source, loggedSets: [...source.loggedSets, pendingSet] } : source;

  return { exercise, pendingSet, setPendingSet };
}
