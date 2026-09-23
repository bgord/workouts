import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

export type WeekCompletedWorkout = {
  id: VO.WorkoutIdType;
  planName: Plans.VO.PlanNameType;
  planSectionName: Plans.VO.PlanSectionNameType;
  scheduledFor: VO.WorkoutScheduledForType;
  loggedSets: Array<{ reps: VO.RepsType; load: VO.LoadType }>;
};

export interface ListWeekCompletedWorkouts {
  execute(userId: Auth.VO.UserIdType, week: tools.Week): Promise<ReadonlyArray<WeekCompletedWorkout>>;
}
