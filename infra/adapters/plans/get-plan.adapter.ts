import type * as bg from "@bgord/bun";
import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

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

    const sections = await db
      .select()
      .from(Schema.planSections)
      .where(and(eq(Schema.planSections.planId, planId), eq(Schema.planSections.userId, userId)))
      .orderBy(asc(Schema.planSections.createdAt));

    const exerciseInstructions = await db
      .select({
        id: Schema.planSectionExerciseInstructions.id,
        planSectionId: Schema.planSectionExerciseInstructions.planSectionId,
        sets: Schema.planSectionExerciseInstructions.sets,
        repsMin: Schema.planSectionExerciseInstructions.repsMin,
        repsMax: Schema.planSectionExerciseInstructions.repsMax,
        exerciseId: Schema.exercises.id,
        exerciseName: Schema.exercises.name,
        exerciseDescription: Schema.exercises.description,
        exerciseImage: Schema.exercises.image,
      })
      .from(Schema.planSectionExerciseInstructions)
      .innerJoin(Schema.exercises, eq(Schema.planSectionExerciseInstructions.exerciseId, Schema.exercises.id))
      .where(
        and(
          eq(Schema.planSectionExerciseInstructions.planId, planId),
          eq(Schema.planSectionExerciseInstructions.userId, userId),
        ),
      )
      .orderBy(asc(Schema.planSectionExerciseInstructions.createdAt));

    const data = {
      id: plan.id,
      name: plan.name,
      status: plan.status,
      revision: plan.revision,
      updatedAt: plan.updatedAt,
      sections: sections.map((section) => ({
        id: section.id,
        name: section.name,
        exerciseInstructions: exerciseInstructions
          .filter((exerciseInstruction) => exerciseInstruction.planSectionId === section.id)
          .map((exerciseInstruction) => ({
            id: exerciseInstruction.id,
            exercise: {
              id: exerciseInstruction.exerciseId,
              name: exerciseInstruction.exerciseName,
              description: exerciseInstruction.exerciseDescription,
              image: exerciseInstruction.exerciseImage,
            },
            sets: exerciseInstruction.sets,
            reps: v.parse(Plans.VO.Reps, {
              min: exerciseInstruction.repsMin,
              max: exerciseInstruction.repsMax,
            }),
          })),
      })),
    };

    const editable = Plans.Invariants.PlanIsEditable.passes({ status: data.status });
    const hasSections = Plans.Invariants.PlanHasSections.passes({ planSections: data.sections });
    const hasNoEmptySections = Plans.Invariants.PlanHasNoEmptySections.passes({
      planSections: data.sections,
    });

    const finalizeBlockers: Array<bg.TranslationsKeyType> = [];

    if (!hasSections) finalizeBlockers.push("plan.finalize.blocked.no_sections");
    if (!hasNoEmptySections) finalizeBlockers.push("plan.finalize.blocked.empty_sections");

    const finalize = { enabled: editable && finalizeBlockers.length === 0, hints: finalizeBlockers };
    const rename = { enabled: editable, hints: [] };
    const editingEnable = {
      enabled: Plans.Invariants.PlanIsFinalized.passes({ status: data.status }),
      hints: [],
    };

    const archive = {
      enabled: Plans.Invariants.PlanIsArchivable.passes({ status: data.status }),
      hints: [],
    };

    const restore = {
      enabled: Plans.Invariants.PlanIsRestorable.passes({ status: data.status }),
      hints: [],
    };

    const remove = {
      enabled: Plans.Invariants.PlanIsRemovable.passes({ status: data.status }),
      hints: [],
    };

    return { data, actions: { finalize, rename, editingEnable, archive, restore, remove } };
  }
}

export const GetPlanQuery = new GetPlanQueryDrizzle();
