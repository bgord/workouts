import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, desc, eq, gte, max, sql } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Workouts from "+workouts";
import { GetFinalizedPlanForOwnerQuery } from "+infra/adapters/plans/get-finalized-plan-for-owner.adapter";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetWorkoutStatusForOwnerCountQuery } from "./get-workout-status-for-owner-count.adapter";

class ListWorkoutsQueryDrizzle implements Workouts.Queries.ListWorkouts {
  async execute(
    userId: Auth.VO.UserIdType,
    config: Workouts.Queries.WorkoutListPageConfig,
    now: tools.Timestamp,
  ): Promise<Workouts.Queries.WorkoutList> {
    const today = now.toZonedDateTimeUTC().startOfDay();

    const range = {
      [Workouts.VO.WorkoutListFilterOptions.last_week]: today.subtract({ weeks: 1 }),
      [Workouts.VO.WorkoutListFilterOptions.last_month]: today.subtract({ months: 1 }),
      [Workouts.VO.WorkoutListFilterOptions.all_time]: null,
    }[config.filter];

    const since = range
      ? v.parse(
          Workouts.VO.WorkoutScheduledFor,
          tools.Day.fromTimestamp(tools.Timestamp.fromInstant(range.toInstant())).toIsoId(),
        )
      : null;

    const period = and(
      eq(Schema.workouts.userId, userId),
      since ? gte(Schema.workouts.scheduledFor, since) : undefined,
    );

    const where = and(
      period,
      config.section ? sql`${Schema.workouts.planSectionId} = ${config.section}` : undefined,
    );

    const [workouts, matching, plan, drafts, sections] = await Promise.all([
      db.query.workouts.findMany({
        columns: {
          id: true,
          planId: true,
          planName: true,
          planSectionId: true,
          planSectionName: true,
          scheduledFor: true,
          status: true,
          completedAt: true,
          revision: true,
        },
        where: and(
          where,
          config.cursor
            ? sql`(${Schema.workouts.scheduledFor}, ${Schema.workouts.id})
                < (${config.cursor.scheduledFor}, ${config.cursor.id})`
            : undefined,
        ),
        orderBy: [desc(Schema.workouts.scheduledFor), desc(Schema.workouts.id)],
        limit: bg.Page.take(config.limit),
      }),
      db.$count(Schema.workouts, where),
      GetFinalizedPlanForOwnerQuery.execute(userId),
      GetWorkoutStatusForOwnerCountQuery.execute(userId, Workouts.VO.WorkoutStatusEnum.draft),
      db
        .select({
          id: Schema.workouts.planSectionId,
          name: Schema.workouts.planSectionName,
          latest: max(Schema.workouts.createdAt),
        })
        .from(Schema.workouts)
        .where(period)
        .groupBy(Schema.workouts.planSectionId)
        .orderBy(desc(max(Schema.workouts.createdAt))),
    ]);

    return {
      data: bg.Page.of(workouts, config.limit, (workout) => ({
        scheduledFor: workout.scheduledFor,
        id: workout.id,
      })),
      matching: tools.Int.nonNegative(matching),
      sections,
      plan,
      actions: new Workouts.Services.WorkoutListActions({
        plan,
        draftCount: drafts,
      }).calculate(),
    };
  }
}

export const ListWorkoutsQuery = new ListWorkoutsQueryDrizzle();
