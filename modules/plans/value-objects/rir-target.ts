import * as tools from "@bgord/tools";
import * as v from "valibot";

export const RirTargetMax = 5;

export const RirTargetError = { Range: "rir.target.range" };

export const RirTarget = v.pipe(
  tools.IntegerNonNegative,
  v.check((value) => value <= RirTargetMax, RirTargetError.Range),
  // Stryker disable next-line StringLiteral
  v.brand("RirTarget"),
);
export type RirTargetType = v.InferOutput<typeof RirTarget>;
