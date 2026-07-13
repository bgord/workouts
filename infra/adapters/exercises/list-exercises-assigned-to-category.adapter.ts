import type * as Exercises from "+exercises";

class ListExercisesAssignedToCategoryQueryDrizzle
  implements Exercises.Queries.ListExercisesAssignedToCategory
{
  async execute(
    _exerciseCategoryId: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    return [];
  }
}

export const ListExercisesAssignedToCategoryQuery = new ListExercisesAssignedToCategoryQueryDrizzle();
