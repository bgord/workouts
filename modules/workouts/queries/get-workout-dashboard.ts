import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export type WorkoutDashboardCompleted = {
  month: tools.IntegerNonNegativeType;
  year: tools.IntegerNonNegativeType;
  total: tools.IntegerNonNegativeType;
};

export type WorkoutDashboardResponse = {
  inProgress: VO.WorkoutSummary | null;
  nextUp: VO.WorkoutSummary | null;
  lastCompleted: VO.WorkoutSummary | null;
  completed: WorkoutDashboardCompleted;
};

export interface GetWorkoutDashboard {
  execute(userId: Auth.VO.UserIdType, now: tools.Timestamp): Promise<WorkoutDashboardResponse>;
}
