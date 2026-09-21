import * as tools from "@bgord/tools";
import { and, asc, desc, eq, gte } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { toWorkoutSummary } from "./to-workout-summary";

class GetWorkoutDashboardQueryDrizzle implements Workouts.Queries.GetWorkoutDashboard {
  async execute(
    userId: Auth.VO.UserIdType,
    now: tools.Timestamp,
  ): Promise<Workouts.Queries.WorkoutDashboardResponse> {
    const today = now.toZonedDateTimeUTC().startOfDay();
    const yearStart = tools.Timestamp.fromInstant(today.with({ month: 1, day: 1 }).toInstant()).ms;

    const withStatus = (status: Workouts.VO.WorkoutStatusEnum) =>
      and(eq(Schema.workouts.userId, userId), eq(Schema.workouts.status, status));

    const completed = withStatus(Workouts.VO.WorkoutStatusEnum.completed);

    const [inProgress, nextUp, lastCompleted, month, year, total] = await Promise.all([
      db.select().from(Schema.workouts).where(withStatus(Workouts.VO.WorkoutStatusEnum.in_progress)).get(),
      db
        .select()
        .from(Schema.workouts)
        .where(withStatus(Workouts.VO.WorkoutStatusEnum.draft))
        .orderBy(asc(Schema.workouts.scheduledFor), asc(Schema.workouts.createdAt))
        .get(),
      db.select().from(Schema.workouts).where(completed).orderBy(desc(Schema.workouts.scheduledFor)).get(),
      db.$count(
        Schema.workouts,
        and(
          completed,
          gte(
            // @ts-expect-error
            Schema.workouts.scheduledFor,
            tools.Day.fromTimestamp(
              tools.Timestamp.fromInstant(today.with({ day: 1 }).toInstant()),
            ).toIsoId(),
          ),
        ),
      ),
      db.$count(Schema.workouts, and(completed, gte(Schema.workouts.completedAt, yearStart))),
      db.$count(Schema.workouts, completed),
    ]);

    return {
      inProgress: inProgress ? toWorkoutSummary(inProgress) : null,
      nextUp: nextUp ? toWorkoutSummary(nextUp) : null,
      lastCompleted: lastCompleted ? toWorkoutSummary(lastCompleted) : null,
      completed: {
        month: tools.Int.nonNegative(month),
        year: tools.Int.nonNegative(year),
        total: tools.Int.nonNegative(total),
      },
    };
  }
}

export const GetWorkoutDashboardQuery = new GetWorkoutDashboardQueryDrizzle();
