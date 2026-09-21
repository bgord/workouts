import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT = "PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT";

export const PlanSectionExerciseInstructionMovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstructionId: VO.ExerciseInstructionId,
    position: VO.ExerciseInstructionPosition,
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionMovedEventType = v.InferOutput<
  typeof PlanSectionExerciseInstructionMovedEvent
>;
