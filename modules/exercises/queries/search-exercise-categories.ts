import type * as tools from "@bgord/tools";
import type * as VO from "+exercises/value-objects";

export interface SearchExerciseCategories {
  execute(
    name: VO.ExerciseCategoryNameType,
    limit: tools.IntegerPositiveType,
  ): Promise<ReadonlyArray<VO.ExerciseCategory>>;
}
