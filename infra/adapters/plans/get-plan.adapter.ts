import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetPlanQueryDrizzle implements Plans.Queries.GetPlan {
  async execute(planId: Plans.VO.PlanIdType, userId: Auth.VO.UserIdType): Promise<Plans.VO.Plan | null> {
    const plan = await db
      .select()
      .from(Schema.plans)
      .where(and(eq(Schema.plans.id, planId), eq(Schema.plans.userId, userId)))
      .get();

    if (!plan) return null;

    const sections = await db
      .select()
      .from(Schema.planSections)
      .where(and(eq(Schema.planSections.planId, planId), eq(Schema.planSections.userId, userId)))
      .orderBy(asc(Schema.planSections.createdAt));

    const exerciseInstructions = await db
      .select()
      .from(Schema.planSectionExerciseInstructions)
      .where(
        and(
          eq(Schema.planSectionExerciseInstructions.planId, planId),
          eq(Schema.planSectionExerciseInstructions.userId, userId),
        ),
      )
      .orderBy(asc(Schema.planSectionExerciseInstructions.createdAt));

    return {
      id: plan.id,
      name: plan.name,
      status: plan.status,
      sections: sections.map((section) => ({
        id: section.id,
        name: section.name,
        exerciseInstructions: exerciseInstructions
          .filter((exerciseInstruction) => exerciseInstruction.planSectionId === section.id)
          .map((exerciseInstruction) => ({
            id: exerciseInstruction.id,
            exerciseId: exerciseInstruction.exerciseId,
            sets: exerciseInstruction.sets,
            reps: v.parse(Plans.VO.Reps, {
              min: exerciseInstruction.repsMin,
              max: exerciseInstruction.repsMax,
            }),
          })),
      })),
    };
  }
}

export const GetPlanQuery = new GetPlanQueryDrizzle();
