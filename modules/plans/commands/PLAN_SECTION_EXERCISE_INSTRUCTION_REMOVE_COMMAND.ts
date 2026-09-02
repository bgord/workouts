import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND =
  // Stryker disable next-line StringLiteral
  "PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND";

export const PlanSectionExerciseInstructionRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstructionId: VO.ExerciseInstructionId,
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionRemoveCommandType = v.InferOutput<
  typeof PlanSectionExerciseInstructionRemoveCommand
>;
