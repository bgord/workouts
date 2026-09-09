import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+statistics/value-objects";

export interface GetExerciseOneRepMaxEstimate {
  execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<VO.OneRepMaxEstimateType | null>;
}
