import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const ExerciseId = bg.UUID;
export type ExerciseIdType = v.InferOutput<typeof ExerciseId>;
