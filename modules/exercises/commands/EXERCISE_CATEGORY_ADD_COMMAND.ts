import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";
import { ExerciseCategoryName } from "../value-objects/exercise-category-name";

// Stryker disable next-line StringLiteral
export const EXERCISE_CATEGORY_ADD_COMMAND = "EXERCISE_CATEGORY_ADD_COMMAND";

export const ExerciseCategoryAddCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_ADD_COMMAND),
  payload: v.object({ id: ExerciseCategoryId, name: ExerciseCategoryName }),
});

export type ExerciseCategoryAddCommandType = v.InferOutput<typeof ExerciseCategoryAddCommand>;
