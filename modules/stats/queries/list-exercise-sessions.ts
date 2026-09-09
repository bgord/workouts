import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+stats/value-objects";

export interface ListExerciseSessions {
  execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Array<VO.ExerciseSession>>;
}
