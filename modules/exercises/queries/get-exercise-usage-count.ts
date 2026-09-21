import type * as tools from "@bgord/tools";
import type * as VO from "+exercises/value-objects";

export interface GetExerciseUsageCount {
  execute(exerciseId: VO.ExerciseIdType): Promise<tools.IntegerNonNegativeType>;
}
