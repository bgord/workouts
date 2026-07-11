import { GetExerciseQuery } from "./get-exercise.adapter";
import { GetExerciseCategoryQuery } from "./get-exercise-category.adapter";
import { GetExerciseCategoryNameCount } from "./get-exercise-category-name-count.adapter";
import { GetExerciseNameCount } from "./get-exercise-name-count.adapter";
import { ListExercisesQuery } from "./list-exercises.adapter";

export function createExercisesAdapters() {
  return {
    ListExercisesQuery,
    GetExerciseNameCount,
    GetExerciseQuery,
    GetExerciseCategoryNameCount,
    GetExerciseCategoryQuery,
  };
}
