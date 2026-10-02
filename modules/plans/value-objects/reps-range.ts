import * as tools from "@bgord/tools";
import * as v from "valibot";

export const RepsRangeError = { Type: "reps.range.type", Invalid: "reps.range.invalid" };

export const RepsRange = v.pipe(
  v.object({ min: tools.IntegerPositive, max: tools.IntegerPositive }, RepsRangeError.Type),
  v.check((value) => value.max >= value.min, RepsRangeError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("RepsRange"),
);
export type RepsRangeType = v.InferOutput<typeof RepsRange>;
