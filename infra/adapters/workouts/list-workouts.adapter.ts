import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, desc, eq, gte, max, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetWorkoutStatusForOwnerCountQuery } from "./get-workout-status-for-owner-count.adapter";
import { toWorkoutSummary } from "./to-workout-summary";

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
      ? tools.Day.fromTimestamp(tools.Timestamp.fromInstant(range.toInstant())).toIsoId()
      : null;

    const scope = and(
      eq(Schema.workouts.userId, userId),
      // @ts-expect-error
      since ? gte(Schema.workouts.scheduledFor, since) : undefined,
    );

    const [workouts, finalizedPlan, drafts] = await Promise.all([
      db.select().from(Schema.workouts).where(scope).orderBy(desc(Schema.workouts.scheduledFor)),
      db
        .select({
          id: Schema.plans.id,
          name: Schema.plans.name,
          status: Schema.plans.status,
          revision: Schema.plans.revision,
        })
        .from(Schema.plans)
        .where(
          and(eq(Schema.plans.userId, userId), eq(Schema.plans.status, Plans.VO.PlanStatusEnum.finalized)),
        )
        .get(),
      GetWorkoutStatusForOwnerCountQuery.execute(userId, Workouts.VO.WorkoutStatusEnum.draft),
    ]);

    const sections = await db
      .select({
        id: Schema.workouts.planSectionId,
        name: sql<Plans.VO.PlanSectionNameType>`coalesce(${Schema.planSections.name}, ${Schema.workouts.planSectionName})`,
        latest: max(Schema.workouts.createdAt),
      })
      .from(Schema.workouts)
      .leftJoin(
        Schema.planSections,
        and(
          eq(Schema.planSections.id, Schema.workouts.planSectionId),
          eq(Schema.planSections.userId, userId),
          finalizedPlan ? eq(Schema.planSections.planId, finalizedPlan.id) : sql`0`,
        ),
      )
      .where(scope)
      .groupBy(Schema.workouts.planSectionId)
      .orderBy(desc(max(Schema.workouts.createdAt)));

    const planReady = Workouts.Invariants.WorkoutPlanReady.passes({ plan: finalizedPlan ?? null });
    const draftsAvailable = Workouts.Invariants.WorkoutDraftLimitForOwner.passes({ count: drafts });

    const hints: Array<bg.TranslationsKeyType> = [];

    if (!planReady) hints.push("workout.create.blocked.no_finalized_plan");
    if (!draftsAvailable) hints.push("workout.create.blocked.draft_limit");

    return {
      data: workouts.map(toWorkoutSummary),
      sections: sections.map((section) => ({ id: section.id, name: section.name })),
      actions: { create: { available: true, enabled: planReady && draftsAvailable, hints } },
    };
  }
}

export const ListWorkoutsQuery = new ListWorkoutsQueryDrizzle();
