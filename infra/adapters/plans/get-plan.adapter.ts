import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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

    const [sections, exerciseInstructions] = await Promise.all([
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
    ]);

    const editable = Plans.Invariants.PlanIsEditable.passes({ status: plan.status });
    const whenEditable = { available: editable, enabled: editable, hints: [] };

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
              actions: { update: whenEditable, exerciseChange: whenEditable, remove: whenEditable },
            })),
        };

        const instructionsAvailable = Plans.Invariants.PlanSectionExerciseInstructionLimit.passes({
          planSection,
        });

        return {
          ...planSection,
          actions: {
            exerciseInstructionAdd: {
              available: editable,
              enabled: editable && instructionsAvailable,
              hints: instructionsAvailable ? [] : ["plan.section.exercise.list.limit.hint"],
            },
          },
        };
      }),
    };

    const hasSections = Plans.Invariants.PlanHasSections.passes({ planSections: data.sections });
    const hasNoEmptySections = Plans.Invariants.PlanHasNoEmptySections.passes({
      planSections: data.sections,
    });

    const finalizeBlockers: Array<bg.TranslationsKeyType> = [];

    if (!hasSections) finalizeBlockers.push("plan.finalize.blocked.no_sections");
    if (!hasNoEmptySections) finalizeBlockers.push("plan.finalize.blocked.empty_sections");

    const sectionsAvailable = Plans.Invariants.PlanSectionLimitForPlan.passes({
      count: tools.Int.nonNegative(data.sections.length),
    });

    const finalized = Plans.Invariants.PlanIsFinalized.passes({ status: plan.status });
    const archivable = Plans.Invariants.PlanIsArchivable.passes({ status: plan.status });
    const restorable = Plans.Invariants.PlanIsRestorable.passes({ status: plan.status });
    const removable = Plans.Invariants.PlanIsRemovable.passes({ status: plan.status });

    return {
      data,
      actions: {
        finalize: {
          available: editable,
          enabled: editable && finalizeBlockers.length === 0,
          hints: finalizeBlockers,
        },
        rename: whenEditable,
        descriptionSet: whenEditable,
        editingEnable: { available: finalized, enabled: finalized, hints: [] },
        archive: { available: archivable, enabled: archivable, hints: [] },
        restore: { available: restorable, enabled: restorable, hints: [] },
        remove: { available: removable, enabled: removable, hints: [] },
        sectionCreate: {
          available: editable,
          enabled: editable && sectionsAvailable,
          hints: sectionsAvailable ? [] : ["plan.section.list.limit.hint"],
        },
        sectionRename: whenEditable,
        sectionWarmupSet: whenEditable,
        sectionCooldownSet: whenEditable,
        sectionRemove: whenEditable,
      },
    };
  }
}

export const GetPlanQuery = new GetPlanQueryDrizzle();
