import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
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
    const plan = await db
      .select()
      .from(Schema.plans)
      .where(and(eq(Schema.plans.id, planId), eq(Schema.plans.userId, userId)))
      .get();

    if (!plan) return null;

    const [sections, exerciseInstructions, activeCount] = await Promise.all([
      db
        .select()
        .from(Schema.planSections)
        .where(and(eq(Schema.planSections.planId, planId), eq(Schema.planSections.userId, userId)))
        .orderBy(asc(Schema.planSections.createdAt)),
      db
        .select({
          id: Schema.planSectionExerciseInstructions.id,
          planSectionId: Schema.planSectionExerciseInstructions.planSectionId,
          sets: Schema.planSectionExerciseInstructions.sets,
          reps: {
            min: Schema.planSectionExerciseInstructions.repsMin,
            max: Schema.planSectionExerciseInstructions.repsMax,
          },
          progression: Schema.planSectionExerciseInstructions.progression,
          exercise: {
            id: Schema.exercises.id,
            name: Schema.exercises.name,
            description: Schema.exercises.description,
            image: Schema.exercises.image,
            imageEtag: Schema.exercises.imageEtag,
          },
        })
        .from(Schema.planSectionExerciseInstructions)
        .innerJoin(
          Schema.exercises,
          eq(Schema.planSectionExerciseInstructions.exerciseId, Schema.exercises.id),
        )
        .where(
          and(
            eq(Schema.planSectionExerciseInstructions.planId, planId),
            eq(Schema.planSectionExerciseInstructions.userId, userId),
          ),
        )
        .orderBy(asc(Schema.planSectionExerciseInstructions.position)),
      GetPlanEditableForOwnerCountQuery.execute(userId),
    ]);

    const exerciseInstructionActions = new Plans.Services.PlanGetExerciseInstructionActions({
      status: plan.status,
    }).calculate();

    const data = {
      id: plan.id,
      name: plan.name,
      description: plan.description ?? undefined,
      status: plan.status,
      revision: plan.revision,
      updatedAt: plan.updatedAt,
      sections: sections.map((section) => {
        const planSection = {
          id: section.id,
          name: section.name,
          warmup: section.warmup ?? undefined,
          cooldown: section.cooldown ?? undefined,
          exerciseInstructions: exerciseInstructions
            .filter((exerciseInstruction) => exerciseInstruction.planSectionId === section.id)
            .map((exerciseInstruction) => ({
              id: exerciseInstruction.id,
              exercise: exerciseInstruction.exercise,
              sets: exerciseInstruction.sets,
              reps: v.parse(Plans.VO.Reps, exerciseInstruction.reps),
              progression: exerciseInstruction.progression,
              actions: exerciseInstructionActions,
            })),
        };

        return {
          ...planSection,
          actions: new Plans.Services.PlanGetSectionActions({
            status: plan.status,
            section: planSection,
          }).calculate(),
        };
      }),
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
