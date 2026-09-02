import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";

export interface GetExerciseUsageCount {
  execute(exerciseId: Exercises.VO.ExerciseIdType): Promise<tools.IntegerNonNegativeType>;
}
