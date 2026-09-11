import * as tools from "@bgord/tools";
import { and, asc, desc, eq, gte } from "drizzle-orm";
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
  async execute(
    userId: Auth.VO.UserIdType,
    now: tools.Timestamp,
  ): Promise<Workouts.Queries.WorkoutDashboardResponse> {
    const today = now.toZonedDateTimeUTC().startOfDay();
    const monthStart = tools.Timestamp.fromInstant(today.with({ day: 1 }).toInstant()).ms;
    const yearStart = tools.Timestamp.fromInstant(today.with({ month: 1, day: 1 }).toInstant()).ms;

    const completed = and(
      eq(Schema.workouts.userId, userId),
      eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
    );

    const [inProgress, nextUp, lastCompleted, month, year, total] = await Promise.all([
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
      db.select().from(Schema.workouts).where(completed).orderBy(desc(Schema.workouts.completedAt)).get(),
      db.$count(Schema.workouts, and(completed, gte(Schema.workouts.completedAt, monthStart))),
      db.$count(Schema.workouts, and(completed, gte(Schema.workouts.completedAt, yearStart))),
      db.$count(Schema.workouts, completed),
    ]);

    return {
      inProgress: inProgress ? summarize(inProgress) : null,
      nextUp: nextUp ? summarize(nextUp) : null,
      lastCompleted: lastCompleted ? summarize(lastCompleted) : null,
      completed: {
        month: tools.Int.nonNegative(month),
        year: tools.Int.nonNegative(year),
        total: tools.Int.nonNegative(total),
      },
    };
  }
}

export const GetWorkoutDashboardQuery = new GetWorkoutDashboardQueryDrizzle();
