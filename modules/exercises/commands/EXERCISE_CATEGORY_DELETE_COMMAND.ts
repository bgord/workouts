import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_CATEGORY_DELETE_COMMAND = "EXERCISE_CATEGORY_DELETE_COMMAND";

export const ExerciseCategoryDeleteCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_DELETE_COMMAND),
  payload: v.object({ id: ExerciseCategoryId }),
});

export type ExerciseCategoryDeleteCommandType = v.InferOutput<typeof ExerciseCategoryDeleteCommand>;
