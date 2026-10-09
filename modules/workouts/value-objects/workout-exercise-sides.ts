import type * as Exercises from "+exercises";
import type { RepsType } from "./reps";

export class WorkoutExerciseSides {
  private static readonly count: Record<Exercises.VO.ExerciseLateralityOptions, number> = {
    bilateral: 1,
    unilateral: 2,
  };

  static totalReps(laterality: Exercises.VO.ExerciseLateralityOptions, reps: RepsType): number {
    return reps * WorkoutExerciseSides.count[laterality];
  }
}
