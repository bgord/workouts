import type * as tools from "@bgord/tools";
import type * as VO from "+exercises/value-objects";

export interface GetExerciseCategoryNameCount {
  execute(exerciseCategoryName: VO.ExerciseCategoryNameType): Promise<tools.IntegerNonNegativeType>;
}
