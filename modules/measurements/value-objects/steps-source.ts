import * as v from "valibot";
import { StepsSourceOptions } from "./steps-source-options";

// Stryker disable next-line StringLiteral
export const StepsSourceError = { invalid: "steps.source.invalid" };

export const StepsSource = v.enum(StepsSourceOptions, StepsSourceError.invalid);
export type StepsSourceType = v.InferOutput<typeof StepsSource>;
