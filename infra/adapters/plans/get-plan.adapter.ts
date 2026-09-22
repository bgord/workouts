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
    const [plan, activeCount] = await Promise.all([
      db.query.plans.findFirst({
        columns: { id: true, name: true, description: true, status: true, revision: true, updatedAt: true },
        where: and(eq(Schema.plans.id, planId), eq(Schema.plans.userId, userId)),
        with: {
          sections: {
            columns: { id: true, name: true, warmup: true, cooldown: true },
            orderBy: asc(Schema.planSections.createdAt),
            with: {
              exerciseInstructions: {
                columns: { id: true, sets: true, reps: true, progression: true },
                orderBy: asc(Schema.planSectionExerciseInstructions.position),
                with: {
                  exercise: {
                    columns: { id: true, name: true, description: true, image: true, imageEtag: true },
                  },
                },
              },
            },
          },
        },
      }),
      GetPlanEditableForOwnerCountQuery.execute(userId),
    ]);

    if (!plan) return null;

    const data = {
      ...plan,
      sections: plan.sections.map((section) => ({
        ...section,
        exerciseInstructions: section.exerciseInstructions.map((exerciseInstruction) => ({
          ...exerciseInstruction,
          actions: new Plans.Services.PlanGetExerciseInstructionActions({
            status: plan.status,
            section,
            exerciseInstructionId: exerciseInstruction.id,
          }).calculate(),
        })),
        actions: new Plans.Services.PlanGetSectionActions({ status: plan.status, section }).calculate(),
      })),
    };

    return {
      data,
      actions: new Plans.Services.PlanGetActions({
        status: plan.status,
        sections: data.sections,
        activeCount,
      }).calculate(),
    };
  }
}

export const GetPlanQuery = new GetPlanQueryDrizzle();
