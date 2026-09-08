import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const Volume = v.pipe(tools.WeightGrams, v.brand("Volume"));
export type VolumeType = v.InferOutput<typeof Volume>;
