import { and, asc, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type WorkoutRow = typeof Schema.workouts.$inferSelect;

function summarize(workout: WorkoutRow): Workouts.VO.WorkoutSummary {
  return {
    id: workout.id,
    planId: workout.planId,
    planName: workout.planName,
    planSectionId: workout.planSectionId,
    planSectionName: workout.planSectionName,
    scheduledFor: workout.scheduledFor,
    status: workout.status,
    completedAt: workout.completedAt ?? undefined,
    revision: workout.revision,
  };
}

class GetWorkoutDashboardQueryDrizzle implements Workouts.Queries.GetWorkoutDashboard {
  async execute(userId: Auth.VO.UserIdType): Promise<Workouts.Queries.WorkoutDashboardResponse> {
    const [inProgress, nextUp, lastCompleted] = await Promise.all([
      db
        .select()
        .from(Schema.workouts)
        .where(
          and(
            eq(Schema.workouts.userId, userId),
            eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.in_progress),
          ),
        )
        .get(),
      db
        .select()
        .from(Schema.workouts)
        .where(
          and(
            eq(Schema.workouts.userId, userId),
            eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.draft),
          ),
        )
        .orderBy(asc(Schema.workouts.scheduledFor), asc(Schema.workouts.createdAt))
        .get(),
      db
        .select()
        .from(Schema.workouts)
        .where(
          and(
            eq(Schema.workouts.userId, userId),
            eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          ),
        )
        .orderBy(desc(Schema.workouts.completedAt))
        .get(),
    ]);

    return {
      inProgress: inProgress ? summarize(inProgress) : null,
      nextUp: nextUp ? summarize(nextUp) : null,
      lastCompleted: lastCompleted ? summarize(lastCompleted) : null,
    };
  }
}

export const GetWorkoutDashboardQuery = new GetWorkoutDashboardQueryDrizzle();
