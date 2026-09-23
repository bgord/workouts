import * as tools from "@bgord/tools";
import { and, asc, desc, eq, gte } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

const columns = {
  id: true,
  planId: true,
  planName: true,
  planSectionId: true,
  planSectionName: true,
  scheduledFor: true,
  status: true,
  completedAt: true,
  revision: true,
} as const;

class GetWorkoutDashboardQueryDrizzle implements Workouts.Queries.GetWorkoutDashboard {
  async execute(
    userId: Auth.VO.UserIdType,
    now: tools.Timestamp,
  ): Promise<Workouts.Queries.WorkoutDashboardResponse> {
    const today = now.toZonedDateTimeUTC().startOfDay();
    const monthStart = v.parse(
      Workouts.VO.WorkoutScheduledFor,
      tools.Day.fromTimestamp(tools.Timestamp.fromInstant(today.with({ day: 1 }).toInstant())).toIsoId(),
    );
    const yearStart = v.parse(
      Workouts.VO.WorkoutScheduledFor,
      tools.Day.fromTimestamp(
        tools.Timestamp.fromInstant(today.with({ month: 1, day: 1 }).toInstant()),
      ).toIsoId(),
    );

    const [inProgress, nextUp, lastCompleted, month, year, total] = await Promise.all([
      db.query.workouts.findFirst({
        columns,
        where: and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.in_progress),
        ),
      }),
      db.query.workouts.findFirst({
        columns,
        where: and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.draft),
        ),
        orderBy: [asc(Schema.workouts.scheduledFor), asc(Schema.workouts.createdAt)],
      }),
      db.query.workouts.findFirst({
        columns,
        where: and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
        ),
        orderBy: desc(Schema.workouts.scheduledFor),
      }),
      db.$count(
        Schema.workouts,
        and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          gte(Schema.workouts.scheduledFor, monthStart),
        ),
      ),
      db.$count(
        Schema.workouts,
        and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
          gte(Schema.workouts.scheduledFor, yearStart),
        ),
      ),
      db.$count(
        Schema.workouts,
        and(
          eq(Schema.workouts.userId, userId),
          eq(Schema.workouts.status, Workouts.VO.WorkoutStatusEnum.completed),
        ),
      ),
    ]);

    return {
      inProgress: inProgress ?? null,
      nextUp: nextUp ?? null,
      lastCompleted: lastCompleted ?? null,
      completed: {
        month: tools.Int.nonNegative(month),
        year: tools.Int.nonNegative(year),
        total: tools.Int.nonNegative(total),
      },
    };
  }
}

export const GetWorkoutDashboardQuery = new GetWorkoutDashboardQueryDrizzle();
