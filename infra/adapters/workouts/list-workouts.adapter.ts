import * as tools from "@bgord/tools";
import { and, asc, desc, eq, gte, max } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetWorkoutStatusForOwnerCountQuery } from "./get-workout-status-for-owner-count.adapter";

class ListWorkoutsQueryDrizzle implements Workouts.Queries.ListWorkouts {
  async execute(
    userId: Auth.VO.UserIdType,
    filter: Workouts.VO.WorkoutListFilterOptions,
    now: tools.Timestamp,
  ): Promise<Workouts.Queries.WorkoutListResponse> {
    const today = now.toZonedDateTimeUTC().startOfDay();

    const range = {
      [Workouts.VO.WorkoutListFilterOptions.last_week]: today.subtract({ weeks: 1 }),
      [Workouts.VO.WorkoutListFilterOptions.last_month]: today.subtract({ months: 1 }),
      [Workouts.VO.WorkoutListFilterOptions.all_time]: null,
    }[filter];

    const since = range
      ? v.parse(
          Workouts.VO.WorkoutScheduledFor,
          tools.Day.fromTimestamp(tools.Timestamp.fromInstant(range.toInstant())).toIsoId(),
        )
      : null;

    const [workouts, plan, drafts, sections] = await Promise.all([
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
          eq(Schema.workouts.userId, userId),
          since ? gte(Schema.workouts.scheduledFor, since) : undefined,
        ),
        orderBy: desc(Schema.workouts.scheduledFor),
      }),
      db.query.plans.findFirst({
        columns: { id: true, name: true },
        where: and(
          eq(Schema.plans.userId, userId),
          eq(Schema.plans.status, Plans.VO.PlanStatusEnum.finalized),
        ),
        with: {
          sections: {
            columns: { id: true, name: true },
            orderBy: asc(Schema.planSections.createdAt),
            with: {
              exerciseInstructions: {
                columns: { id: true },
                orderBy: asc(Schema.planSectionExerciseInstructions.position),
                with: { exercise: { columns: { name: true } } },
              },
            },
          },
        },
      }),
      GetWorkoutStatusForOwnerCountQuery.execute(userId, Workouts.VO.WorkoutStatusEnum.draft),
      db
        .select({
          id: Schema.workouts.planSectionId,
          name: Schema.workouts.planSectionName,
          latest: max(Schema.workouts.createdAt),
        })
        .from(Schema.workouts)
        .where(
          and(
            eq(Schema.workouts.userId, userId),
            since ? gte(Schema.workouts.scheduledFor, since) : undefined,
          ),
        )
        .groupBy(Schema.workouts.planSectionId)
        .orderBy(desc(max(Schema.workouts.createdAt))),
    ]);

    return {
      data: workouts,
      sections,
      plan: plan ?? null,
      actions: new Workouts.Services.WorkoutListActions({
        plan: plan ?? null,
        draftCount: drafts,
      }).calculate(),
    };
  }
}

export const ListWorkoutsQuery = new ListWorkoutsQueryDrizzle();
