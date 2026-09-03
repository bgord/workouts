import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export interface ListWorkouts {
  execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<VO.WorkoutSummary>>;
}
