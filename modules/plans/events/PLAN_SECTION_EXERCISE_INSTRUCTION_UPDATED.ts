import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT =
  "PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT";

export const PlanSectionExerciseInstructionUpdatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstruction: v.omit(VO.ExerciseInstruction, ["exerciseId"]),
    ownerId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionUpdatedEventType = v.InferOutput<
  typeof PlanSectionExerciseInstructionUpdatedEvent
>;
