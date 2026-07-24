import * as tools from "@bgord/tools";
import * as v from "valibot";

export const Reps = v.pipe(tools.IntegerPositive, v.brand("Reps"));
export type RepsType = v.InferOutput<typeof Reps>;
