import * as v from "valibot";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import { GetPlanEditableForOwnerCountQuery } from "./get-plan-editable-for-owner-count.adapter";

class GetPlanQueryDrizzle implements Plans.Queries.GetPlan {
  async execute(
    planId: Plans.VO.PlanIdType,
    userId: Auth.VO.UserIdType,
  ): Promise<Plans.Queries.PlanGetResponse | null> {
    const [plan, activeCount] = await Promise.all([
      db.query.plans.findFirst({
        columns: { id: true, name: true, description: true, status: true, revision: true, updatedAt: true },
        where: (plan, { and, eq }) => and(eq(plan.id, planId), eq(plan.userId, userId)),
        with: {
          sections: {
            columns: { id: true, name: true, warmup: true, cooldown: true },
            orderBy: (section, { asc }) => asc(section.createdAt),
            with: {
              exerciseInstructions: {
                columns: { id: true, sets: true, repsMin: true, repsMax: true, progression: true },
                orderBy: (exerciseInstruction, { asc }) => asc(exerciseInstruction.position),
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
      id: plan.id,
      name: plan.name,
      description: plan.description ?? undefined,
      status: plan.status,
      revision: plan.revision,
      updatedAt: plan.updatedAt,
      sections: plan.sections.map((section) => {
        const planSection = {
          id: section.id,
          name: section.name,
          warmup: section.warmup ?? undefined,
          cooldown: section.cooldown ?? undefined,
          exerciseInstructions: section.exerciseInstructions.map((exerciseInstruction) => ({
            id: exerciseInstruction.id,
            exercise: exerciseInstruction.exercise,
            sets: exerciseInstruction.sets,
            reps: v.parse(Plans.VO.Reps, {
              min: exerciseInstruction.repsMin,
              max: exerciseInstruction.repsMax,
            }),
            progression: exerciseInstruction.progression,
          })),
        };

        return {
          ...planSection,
          exerciseInstructions: planSection.exerciseInstructions.map((exerciseInstruction) => ({
            ...exerciseInstruction,
            actions: new Plans.Services.PlanGetExerciseInstructionActions({
              status: plan.status,
              section: planSection,
              exerciseInstructionId: exerciseInstruction.id,
            }).calculate(),
          })),
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
