import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListWorkoutsQueryDrizzle implements Workouts.Queries.ListWorkouts {
  async execute(userId: Auth.VO.UserIdType): Promise<Workouts.Queries.WorkoutListResponse> {
    const workouts = await db
      .select()
      .from(Schema.workouts)
      .where(eq(Schema.workouts.userId, userId))
      .orderBy(desc(Schema.workouts.createdAt));

    const finalizedPlan = await db
      .select({
        id: Schema.plans.id,
        name: Schema.plans.name,
        status: Schema.plans.status,
        revision: Schema.plans.revision,
      })
      .from(Schema.plans)
      .where(and(eq(Schema.plans.userId, userId), eq(Schema.plans.status, Plans.VO.PlanStatusEnum.finalized)))
      .get();

    const data = workouts.map((workout) => ({
      id: workout.id,
      planId: workout.planId,
      planName: workout.planName,
      planSectionId: workout.planSectionId,
      planSectionName: workout.planSectionName,
      scheduledFor: workout.scheduledFor,
      status: workout.status,
      completedAt: workout.completedAt ?? undefined,
      revision: workout.revision,
    }));

    const drafts = data.filter((workout) => workout.status === Workouts.VO.WorkoutStatusEnum.draft).length;

    const planReady = Workouts.Invariants.WorkoutPlanReady.passes({ plan: finalizedPlan ?? null });
    const draftsAvailable = Workouts.Invariants.WorkoutDraftLimitForOwner.passes({
      count: tools.Int.nonNegative(drafts),
    });

    const hints: Array<bg.TranslationsKeyType> = [];

    if (!planReady) hints.push("workout.create.blocked.no_finalized_plan");
    if (!draftsAvailable) hints.push("workout.create.blocked.draft_limit");

    return { data, actions: { create: { enabled: planReady && draftsAvailable, hints } } };
  }
}

export const ListWorkoutsQuery = new ListWorkoutsQueryDrizzle();
