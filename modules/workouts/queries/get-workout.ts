import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export interface GetWorkout {
  execute(workoutId: VO.WorkoutIdType, userId: Auth.VO.UserIdType): Promise<VO.Workout | null>;
}
