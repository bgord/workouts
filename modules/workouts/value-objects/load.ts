import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const Load = v.pipe(tools.WeightGrams, v.brand("Load"));
export type LoadType = v.InferOutput<typeof Load>;
