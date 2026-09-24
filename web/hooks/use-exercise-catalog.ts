import { useState } from "react";
import type { ExerciseListResponse } from "../../modules/exercises/queries/list-exercises-with-categories";
import { Exercises } from "../api";

export function useExerciseCatalog() {
  const [exercises, setExercises] = useState<Promise<ExerciseListResponse> | null>(null);

  const load = () => setExercises((current) => current ?? Exercises.list(null));

  return { exercises, load };
}
