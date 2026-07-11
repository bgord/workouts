import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";

export interface GetExerciseCategoryNameCount {
  execute(exerciseName: Exercises.VO.ExerciseCategoryNameType): Promise<tools.IntegerNonNegativeType>;
}
