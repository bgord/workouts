import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseId } from "../value-objects/exercise-id";
import { ExerciseResistance } from "../value-objects/exercise-resistance";

// Stryker disable next-line StringLiteral
export const EXERCISE_RESISTANCE_CHANGE_COMMAND = "EXERCISE_RESISTANCE_CHANGE_COMMAND";

export const ExerciseResistanceChangeCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_RESISTANCE_CHANGE_COMMAND),
  payload: v.object({ id: ExerciseId, resistance: ExerciseResistance, requesterId: Auth.VO.UserId }),
});

export type ExerciseResistanceChangeCommandType = v.InferOutput<typeof ExerciseResistanceChangeCommand>;
