import type * as Exercises from "+exercises";

class ListCategoriesAssignedToExerciseQueryDrizzle
  implements Exercises.Queries.ListCategoriesAssignedToExercise
{
  async execute(
    _exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<ReadonlyArray<Exercises.VO.ExerciseCategoryIdType>> {
    return [];
  }
}

export const ListCategoriesAssignedToExerciseQuery = new ListCategoriesAssignedToExerciseQueryDrizzle();
