import * as bg from "@bgord/bun";
import * as v from "valibot";

export const ExerciseInstructionId = v.pipe(bg.UUID, v.brand("ExerciseInstructionId"));
export type ExerciseInstructionIdType = v.InferOutput<typeof ExerciseInstructionId>;
