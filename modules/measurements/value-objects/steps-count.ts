import * as tools from "@bgord/tools";
import * as v from "valibot";
import { StepsCountMax } from "./steps-count.validation";

export const StepsCountError = { Range: "steps.count.range" };

export const StepsCount = v.pipe(
  tools.IntegerNonNegative,
  v.check((value) => value <= StepsCountMax, StepsCountError.Range),
  // Stryker disable next-line StringLiteral
  v.brand("StepsCount"),
);
export type StepsCountType = v.InferOutput<typeof StepsCount>;
