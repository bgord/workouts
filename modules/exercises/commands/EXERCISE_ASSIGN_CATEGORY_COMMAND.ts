import * as bg from "@bgord/bun";
import * as v from "valibot";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";
import { ExerciseId } from "../value-objects/exercise-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_ASSIGN_CATEGORY_COMMAND = "EXERCISE_ASSIGN_CATEGORY_COMMAND";

export const ExerciseAssignCategoryCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_ASSIGN_CATEGORY_COMMAND),
  payload: v.object({ exerciseId: ExerciseId, exerciseCategoryId: ExerciseCategoryId }),
});

export type ExerciseAssignCategoryCommandType = v.InferOutput<typeof ExerciseAssignCategoryCommand>;
