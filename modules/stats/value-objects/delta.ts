import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const Delta = v.pipe(tools.Integer, v.brand("Delta"));
export type DeltaType = v.InferOutput<typeof Delta>;
