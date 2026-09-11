import { GetExerciseQuery } from "./get-exercise.adapter";
import { GetExerciseCategoryQuery } from "./get-exercise-category.adapter";
import { GetExerciseCategoryNameCountQuery } from "./get-exercise-category-name-count.adapter";
import { GetExerciseNameCountQuery } from "./get-exercise-name-count.adapter";
import { GetExerciseUsageCountQuery } from "./get-exercise-usage-count.adapter";
import { GetExerciseWithCategoriesQuery } from "./get-exercise-with-categories.adapter";
import { ListCategoriesAssignedToExerciseQuery } from "./list-categories-assigned-to-exercise.adapter";
import { ListExerciseCategoriesQuery } from "./list-exercise-categories.adapter";
import { ListExercisesQuery } from "./list-exercises.adapter";
import { ListExercisesWithCategoriesQuery } from "./list-exercises-with-categories.adapter";
import { SearchExerciseCategoriesQuery } from "./search-exercise-categories.adapter";
import { SearchExercisesQuery } from "./search-exercises.adapter";

export function createExercisesAdapters() {
  return {
    GetExerciseCategoryNameCountQuery,
    GetExerciseCategoryQuery,
    GetExerciseNameCountQuery,
    GetExerciseQuery,
    GetExerciseUsageCountQuery,
    GetExerciseWithCategoriesQuery,
    ListCategoriesAssignedToExerciseQuery,
    ListExerciseCategoriesQuery,
    ListExercisesQuery,
    ListExercisesWithCategoriesQuery,
    SearchExerciseCategoriesQuery,
    SearchExercisesQuery,
  };
}
