import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseId } from "../value-objects/exercise-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_IMAGE_CHANGE_COMMAND = "EXERCISE_IMAGE_CHANGE_COMMAND";

export const ExerciseImageChangeCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_IMAGE_CHANGE_COMMAND),
  payload: v.object({ id: ExerciseId, absoluteFilePath: v.pipe(v.string(), v.minLength(1)) }),
});

export type ExerciseImageChangeCommandType = v.InferOutput<typeof ExerciseImageChangeCommand>;
