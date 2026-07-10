import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseDescription } from "../value-objects/exercise-description";
import { ExerciseId } from "../value-objects/exercise-id";
import { ExerciseName } from "../value-objects/exercise-name";

// Stryker disable next-line StringLiteral
export const EXERCISE_ADD_COMMAND = "EXERCISE_ADD_COMMAND";

export const ExerciseAddCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_ADD_COMMAND),
  payload: v.object({
    id: ExerciseId,
    absoluteFilePath: v.pipe(v.string(), v.minLength(1)),
    name: ExerciseName,
    description: ExerciseDescription,
  }),
});

export type ExerciseAddCommandType = v.InferOutput<typeof ExerciseAddCommand>;
