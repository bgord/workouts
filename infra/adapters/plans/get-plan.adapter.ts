import { and, asc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetPlanEditableForOwnerCountQuery } from "./get-plan-editable-for-owner-count.adapter";

class GetPlanQueryDrizzle implements Plans.Queries.GetPlan {
  async execute(
    planId: Plans.VO.PlanIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Plans.Queries.PlanGetResponse | null> {
    const [plan, activeCount, categories] = await Promise.all([
      db.query.plans.findFirst({
        columns: { id: true, name: true, description: true, status: true, revision: true, updatedAt: true },
        where: and(eq(Schema.plans.id, planId), eq(Schema.plans.userId, userId)),
        with: {
          sections: {
            columns: { id: true, name: true, warmup: true, cooldown: true },
            orderBy: asc(Schema.planSections.createdAt),
            with: {
              exerciseInstructions: {
                columns: { id: true, sets: true, reps: true, progression: true, rir: true },
                orderBy: asc(Schema.planSectionExerciseInstructions.position),
                with: {
                  exercise: {
                    columns: {
                      id: true,
                      name: true,
                      description: true,
                      resistance: true,
                      laterality: true,
                      loadStep: true,
                      image: true,
                      imageEtag: true,
                    },
                    with: {
                      categoryAssignments: {
                        columns: { role: true },
                        with: { category: { columns: { id: true, name: true } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      GetPlanEditableForOwnerCountQuery.execute(userId),
      db
        .select({ id: Schema.exerciseCategories.id, name: Schema.exerciseCategories.name })
        .from(Schema.exerciseCategories)
        .orderBy(asc(Schema.exerciseCategories.name)),
    ]);

    if (!plan) return null;

    return new Plans.Services.PlanGetView({ plan, activeCount, categories }).calculate();
  }
}

export const GetPlanQuery = new GetPlanQueryDrizzle();
