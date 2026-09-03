import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const SetNumber = v.pipe(tools.IntegerPositive, v.brand("SetNumber"));
export type SetNumberType = v.InferOutput<typeof SetNumber>;
