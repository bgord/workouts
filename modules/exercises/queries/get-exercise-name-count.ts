import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";

export interface GetExerciseNameCount {
  execute(exerciseName: Exercises.VO.ExerciseNameType): Promise<tools.IntegerNonNegativeType>;
}
