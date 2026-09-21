import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const ExerciseInstructionPosition = v.pipe(
  tools.IntegerNonNegative,
  v.brand("ExerciseInstructionPosition"),
);
export type ExerciseInstructionPositionType = v.InferOutput<typeof ExerciseInstructionPosition>;
