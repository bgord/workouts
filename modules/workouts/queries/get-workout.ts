import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export type WorkoutGetResponse = { data: VO.Workout; actions: { complete: ActionState } };

export interface GetWorkout {
  execute(workoutId: VO.WorkoutIdType, userId: Auth.VO.UserIdType): Promise<WorkoutGetResponse | null>;
}
