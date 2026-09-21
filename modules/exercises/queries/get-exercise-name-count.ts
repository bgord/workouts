import type * as tools from "@bgord/tools";
import type * as VO from "+exercises/value-objects";

export interface GetExerciseNameCount {
  execute(exerciseName: VO.ExerciseNameType): Promise<tools.IntegerNonNegativeType>;
}
