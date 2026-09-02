import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseId } from "../value-objects/exercise-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_DELETE_COMMAND = "EXERCISE_DELETE_COMMAND";

export const ExerciseDeleteCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_DELETE_COMMAND),
  payload: v.object({ id: ExerciseId, requesterId: Auth.VO.UserId }),
});

export type ExerciseDeleteCommandType = v.InferOutput<typeof ExerciseDeleteCommand>;
