import type * as Workouts from "+workouts";
import type * as Schema from "+infra/schema";

export function toWorkoutSummary(workout: typeof Schema.workouts.$inferSelect): Workouts.VO.WorkoutSummary {
  return {
    id: workout.id,
    planId: workout.planId,
    planName: workout.planName,
    planSectionId: workout.planSectionId,
    planSectionName: workout.planSectionName,
    scheduledFor: workout.scheduledFor,
    status: workout.status,
    completedAt: workout.completedAt,
    revision: workout.revision,
  };
}
