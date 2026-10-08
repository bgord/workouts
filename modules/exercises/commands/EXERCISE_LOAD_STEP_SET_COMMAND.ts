import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseId } from "../value-objects/exercise-id";
import { ExerciseLoadStep } from "../value-objects/exercise-load-step";

// Stryker disable next-line StringLiteral
export const EXERCISE_LOAD_STEP_SET_COMMAND = "EXERCISE_LOAD_STEP_SET_COMMAND";

export const ExerciseLoadStepSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_LOAD_STEP_SET_COMMAND),
  payload: v.object({ id: ExerciseId, loadStep: ExerciseLoadStep, requesterId: Auth.VO.UserId }),
});

export type ExerciseLoadStepSetCommandType = v.InferOutput<typeof ExerciseLoadStepSetCommand>;
