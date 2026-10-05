import type * as tools from "@bgord/tools";
import type * as VO from "+exercises/value-objects";

export interface GetExerciseCategoryNameCount {
  execute(
    exerciseCategoryName: VO.ExerciseCategoryNameType,
    excludedExerciseCategoryId?: VO.ExerciseCategoryIdType,
  ): Promise<tools.IntegerNonNegativeType>;
}
