import * as tools from "@bgord/tools";
import * as v from "valibot";

export const BodyWeightError = { Invalid: "body.weight.invalid" };

export const BodyWeight = v.pipe(
  tools.WeightGrams,
  v.check((value) => value > 0, BodyWeightError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("BodyWeight"),
);
export type BodyWeightType = v.InferOutput<typeof BodyWeight>;
