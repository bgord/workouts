import * as tools from "@bgord/tools";
import * as v from "valibot";
import { RirMax } from "./rir-limit";

export const RirError = { Range: "rir.range" };

export const Rir = v.pipe(
  tools.IntegerNonNegative,
  v.check((value) => value <= RirMax, RirError.Range),
  // Stryker disable next-line StringLiteral
  v.brand("Rir"),
);
export type RirType = v.InferOutput<typeof Rir>;
