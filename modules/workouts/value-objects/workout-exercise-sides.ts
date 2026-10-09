import * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type { RepsType } from "./reps";

export class WorkoutExerciseSides {
  private static readonly count: Record<Exercises.VO.ExerciseLateralityOptions, tools.IntegerPositiveType> = {
    bilateral: tools.Int.positive(1),
    unilateral: tools.Int.positive(2),
  };

  static totalReps(
    laterality: Exercises.VO.ExerciseLateralityOptions,
    reps: RepsType,
  ): tools.IntegerPositiveType {
    return tools.Int.positive(reps * WorkoutExerciseSides.count[laterality]);
  }
}
