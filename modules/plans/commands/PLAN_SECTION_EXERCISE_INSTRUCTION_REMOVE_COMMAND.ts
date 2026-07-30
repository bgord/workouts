import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

// Stryker disable next-line StringLiteral
export const PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND =
  "PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND";

export const PlanSectionExerciseInstructionRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstructionId: VO.ExerciseInstructionId,
    userId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionRemoveCommandType = v.InferOutput<
  typeof PlanSectionExerciseInstructionRemoveCommand
>;
