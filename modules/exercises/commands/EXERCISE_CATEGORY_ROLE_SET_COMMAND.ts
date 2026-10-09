import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseCategoryId } from "../value-objects/exercise-category-id";
import { ExerciseCategoryRole } from "../value-objects/exercise-category-role";
import { ExerciseId } from "../value-objects/exercise-id";

// Stryker disable next-line StringLiteral
export const EXERCISE_CATEGORY_ROLE_SET_COMMAND = "EXERCISE_CATEGORY_ROLE_SET_COMMAND";

export const ExerciseCategoryRoleSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_ROLE_SET_COMMAND),
  payload: v.object({
    exerciseId: ExerciseId,
    exerciseCategoryId: ExerciseCategoryId,
    role: ExerciseCategoryRole,
    requesterId: Auth.VO.UserId,
  }),
});

export type ExerciseCategoryRoleSetCommandType = v.InferOutput<typeof ExerciseCategoryRoleSetCommand>;
