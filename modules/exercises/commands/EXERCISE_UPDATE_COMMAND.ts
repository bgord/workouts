import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseDescription } from "../value-objects/exercise-description";
import { ExerciseId } from "../value-objects/exercise-id";
import { ExerciseName } from "../value-objects/exercise-name";

// Stryker disable next-line StringLiteral
export const EXERCISE_UPDATE_COMMAND = "EXERCISE_UPDATE_COMMAND";

export const ExerciseUpdateCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_UPDATE_COMMAND),
  payload: v.object({ id: ExerciseId, name: ExerciseName, description: ExerciseDescription }),
});

export type ExerciseUpdateCommandType = v.InferOutput<typeof ExerciseUpdateCommand>;
