import * as v from "valibot";
import { StepsSourceOptions } from "./steps-source-options";

export const StepsSourceError = { invalid: "steps.source.invalid" };

export const StepsSource = v.enum(StepsSourceOptions, StepsSourceError.invalid);
export type StepsSourceType = v.InferOutput<typeof StepsSource>;
