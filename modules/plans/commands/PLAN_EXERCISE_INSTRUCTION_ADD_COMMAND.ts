import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_EXERCISE_INSTRUCTION_ADD_COMMAND = "PLAN_EXERCISE_INSTRUCTION_ADD_COMMAND";

export const PlanExerciseInstructionAddCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_EXERCISE_INSTRUCTION_ADD_COMMAND),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstruction: VO.ExerciseInstruction,
    ownerId: Auth.VO.UserId,
  }),
});

export type PlanExerciseInstructionAddCommandType = v.InferOutput<typeof PlanExerciseInstructionAddCommand>;
