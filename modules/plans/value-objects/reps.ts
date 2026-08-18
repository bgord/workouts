import * as tools from "@bgord/tools";
import * as v from "valibot";

export const RepsError = { Type: "reps.type", Range: "reps.range" };

export const Reps = v.pipe(
  v.object({ min: tools.IntegerPositive, max: tools.IntegerPositive }, RepsError.Type),
  v.check((value) => value.max >= value.min, RepsError.Range),
  // Stryker disable next-line StringLiteral
  v.brand("Reps"),
);
export type RepsType = v.InferOutput<typeof Reps>;
