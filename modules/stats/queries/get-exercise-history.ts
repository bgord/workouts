import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+stats/value-objects";

export type ExerciseHistoryGetResponse = {
  sessions: Array<VO.ExerciseSession>;
  record?: VO.ExerciseRecord;
  estimatedRecord?: VO.EstimatedRecord;
};

export interface GetExerciseHistory {
  execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<ExerciseHistoryGetResponse>;
}
