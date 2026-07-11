import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const ExerciseCategoryId = bg.UUID;
export type ExerciseCategoryIdType = v.InferOutput<typeof ExerciseCategoryId>;
