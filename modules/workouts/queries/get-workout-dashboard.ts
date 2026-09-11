import type * as Auth from "+auth";
import type * as VO from "+workouts/value-objects";

export type WorkoutDashboardResponse = {
  inProgress: VO.WorkoutSummary | null;
  nextUp: VO.WorkoutSummary | null;
  lastCompleted: VO.WorkoutSummary | null;
};

export interface GetWorkoutDashboard {
  execute(userId: Auth.VO.UserIdType): Promise<WorkoutDashboardResponse>;
}
