import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT =
  "PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT";

export const PlanSectionExerciseInstructionRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstructionId: VO.ExerciseInstructionId,
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionRemovedEventType = v.InferOutput<
  typeof PlanSectionExerciseInstructionRemovedEvent
>;
