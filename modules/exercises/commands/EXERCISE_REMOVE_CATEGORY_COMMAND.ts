import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";
import { ExerciseId } from "../value-objects/exercise-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_REMOVE_CATEGORY_COMMAND = "EXERCISE_REMOVE_CATEGORY_COMMAND";

export const ExerciseRemoveCategoryCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_REMOVE_CATEGORY_COMMAND),
  payload: v.object({ exerciseId: ExerciseId, exerciseCategoryId: ExerciseCategoryId }),
});

export type ExerciseRemoveCategoryCommandType = v.InferOutput<typeof ExerciseRemoveCategoryCommand>;
