import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT =
  "PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT";

export const PlanSectionExerciseInstructionExerciseChangedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstruction: v.pick(VO.ExerciseInstruction, ["id", "exerciseId"]),
    ownerId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionExerciseChangedEventType = v.InferOutput<
  typeof PlanSectionExerciseInstructionExerciseChangedEvent
>;
