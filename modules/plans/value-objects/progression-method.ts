import * as v from "valibot";
import { ProgressionMethodOptions } from "./progression-method-options";

export const ProgressionMethodError = { invalid: "progression.method.invalid" };

export const ProgressionMethod = v.enum(ProgressionMethodOptions, ProgressionMethodError.invalid);
export type ProgressionMethodType = v.InferOutput<typeof ProgressionMethod>;
