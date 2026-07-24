import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_EXERCISE_INSTRUCTION_ADDED_EVENT = "PLAN_EXERCISE_INSTRUCTION_ADDED_EVENT";

export const PlanExerciseInstructionAddedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_EXERCISE_INSTRUCTION_ADDED_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstruction: VO.ExerciseInstruction,
    ownerId: Auth.VO.UserId,
  }),
});

export type PlanExerciseInstructionAddedEventType = v.InferOutput<typeof PlanExerciseInstructionAddedEvent>;
