import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGE_COMMAND =
  "PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGE_COMMAND";

export const PlanSectionExerciseInstructionExerciseChangeCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGE_COMMAND),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    exerciseInstruction: v.pick(VO.ExerciseInstruction, ["id", "exerciseId"]),
    ownerId: Auth.VO.UserId,
  }),
});

export type PlanSectionExerciseInstructionExerciseChangeCommandType = v.InferOutput<
  typeof PlanSectionExerciseInstructionExerciseChangeCommand
>;
