import type * as Auth from "+auth";
import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

export type WorkoutListResponse = {
  data: ReadonlyArray<VO.WorkoutSummary>;
  actions: { create: Plans.Queries.ActionState };
};

export interface ListWorkouts {
  execute(userId: Auth.VO.UserIdType): Promise<WorkoutListResponse>;
}
