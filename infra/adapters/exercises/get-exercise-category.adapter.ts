import type * as Exercises from "+exercises";

class GetExerciseCategoryQueryDrizzle implements Exercises.Queries.GetExerciseCategory {
  async execute(
    _exerciseCategoryId: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<Exercises.VO.ExerciseCategory | null> {
    return null;
  }
}

export const GetExerciseCategoryQuery = new GetExerciseCategoryQueryDrizzle();
