import * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";

class GetExerciseCategoryNameCountQueryDrizzle implements Exercises.Queries.GetExerciseCategoryNameCount {
  async execute(
    _exerciseCategoryName: Exercises.VO.ExerciseCategoryNameType,
  ): Promise<tools.IntegerNonNegativeType> {
    return tools.Int.nonNegative(0);
  }
}

export const GetExerciseCategoryNameCount = new GetExerciseCategoryNameCountQueryDrizzle();
