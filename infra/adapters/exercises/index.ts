import { GetExerciseQuery } from "./get-exercise.adapter";
import { GetExerciseCategoryQuery } from "./get-exercise-category.adapter";
import { GetExerciseCategoryNameCountQuery } from "./get-exercise-category-name-count.adapter";
import { GetExerciseNameCountQuery } from "./get-exercise-name-count.adapter";
import { ListExercisesQuery } from "./list-exercises.adapter";

export function createExercisesAdapters() {
  return {
    ListExercisesQuery,
    GetExerciseNameCountQuery,
    GetExerciseQuery,
    GetExerciseCategoryNameCountQuery,
    GetExerciseCategoryQuery,
  };
}
