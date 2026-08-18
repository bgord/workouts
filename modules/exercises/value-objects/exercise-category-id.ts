import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const ExerciseCategoryId = v.pipe(bg.UUID, v.brand("ExerciseCategoryId"));
export type ExerciseCategoryIdType = v.InferOutput<typeof ExerciseCategoryId>;
