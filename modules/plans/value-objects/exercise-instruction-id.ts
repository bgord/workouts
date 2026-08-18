import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const ExerciseInstructionId = v.pipe(bg.UUID, v.brand("ExerciseInstructionId"));
export type ExerciseInstructionIdType = v.InferOutput<typeof ExerciseInstructionId>;
