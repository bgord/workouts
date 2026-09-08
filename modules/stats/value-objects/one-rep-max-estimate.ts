import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const OneRepMaxEstimate = v.pipe(tools.WeightGrams, v.brand("OneRepMaxEstimate"));
export type OneRepMaxEstimateType = v.InferOutput<typeof OneRepMaxEstimate>;
