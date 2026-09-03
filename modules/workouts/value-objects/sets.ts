import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const Sets = v.pipe(tools.IntegerPositive, v.brand("Sets"));
export type SetsType = v.InferOutput<typeof Sets>;
