import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const Reps = v.pipe(tools.IntegerPositive, v.brand("Reps"));
export type RepsType = v.InferOutput<typeof Reps>;
