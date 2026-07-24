import * as tools from "@bgord/tools";
import * as v from "valibot";

export const RepsError = { Range: "reps.range" };

export const Reps = v.pipe(
  v.object({ min: tools.IntegerPositive, max: tools.IntegerPositive }),
  v.check((value) => value.max >= value.min, RepsError.Range),
  v.brand("Reps"),
);
export type RepsType = v.InferOutput<typeof Reps>;
