import * as tools from "@bgord/tools";
import * as v from "valibot";

export const ExerciseInstructionPosition = v.pipe(
  tools.IntegerNonNegative,
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseInstructionPosition"),
);
export type ExerciseInstructionPositionType = v.InferOutput<typeof ExerciseInstructionPosition>;
