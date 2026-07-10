import * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";

class GetExerciseNameCountQueryDrizzle implements Exercises.Queries.GetExerciseNameCount {
  async execute(_exerciseName: Exercises.VO.ExerciseNameType): Promise<tools.IntegerNonNegativeType> {
    return tools.Int.nonNegative(0);
  }
}

export const GetExerciseNameCount = new GetExerciseNameCountQueryDrizzle();
