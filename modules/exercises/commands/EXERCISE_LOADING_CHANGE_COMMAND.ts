import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseId } from "../value-objects/exercise-id";
import { ExerciseLoading } from "../value-objects/exercise-loading";

// Stryker disable next-line StringLiteral
export const EXERCISE_LOADING_CHANGE_COMMAND = "EXERCISE_LOADING_CHANGE_COMMAND";

export const ExerciseLoadingChangeCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_LOADING_CHANGE_COMMAND),
  payload: v.object({ id: ExerciseId, loading: ExerciseLoading, requesterId: Auth.VO.UserId }),
});

export type ExerciseLoadingChangeCommandType = v.InferOutput<typeof ExerciseLoadingChangeCommand>;
