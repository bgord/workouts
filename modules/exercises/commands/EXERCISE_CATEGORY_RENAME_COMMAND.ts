import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";
import { ExerciseCategoryName } from "../value-objects/exercise-category-name";

// Stryker disable next-line StringLiteral
export const EXERCISE_CATEGORY_RENAME_COMMAND = "EXERCISE_CATEGORY_RENAME_COMMAND";

export const ExerciseCategoryRenameCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_RENAME_COMMAND),
  payload: v.object({ id: ExerciseCategoryId, name: ExerciseCategoryName, userId: Auth.VO.UserId }),
});

export type ExerciseCategoryRenameCommandType = v.InferOutput<typeof ExerciseCategoryRenameCommand>;
