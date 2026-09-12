import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const BodyWeight = v.pipe(tools.WeightGrams, v.brand("BodyWeight"));
export type BodyWeightType = v.InferOutput<typeof BodyWeight>;
