import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";
import { ExerciseId } from "../value-objects/exercise-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_UNASSIGN_CATEGORY_COMMAND = "EXERCISE_UNASSIGN_CATEGORY_COMMAND";

export const ExerciseUnassignCategoryCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_UNASSIGN_CATEGORY_COMMAND),
  payload: v.object({ exerciseId: ExerciseId, exerciseCategoryId: ExerciseCategoryId }),
});

export type ExerciseUnassignCategoryCommandType = v.InferOutput<typeof ExerciseUnassignCategoryCommand>;
