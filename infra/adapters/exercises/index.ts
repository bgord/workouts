import { GetExerciseNameCount } from "./get-exercise-name-count.adapter";
import { ListExercisesQuery } from "./list-exercises.adapter";

export function createExercisesAdapters() {
  return { ListExercisesQuery, GetExerciseNameCount };
}
