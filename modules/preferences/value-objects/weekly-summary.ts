import * as v from "valibot";
import { WeeklySummaryOptions } from "./weekly-summary-options";

export const WeeklySummaryError = { invalid: "weekly.summary.invalid" };

export const WeeklySummary = v.enum(WeeklySummaryOptions, WeeklySummaryError.invalid);
export type WeeklySummaryType = v.InferOutput<typeof WeeklySummary>;

export const WeeklySummaryDefault = WeeklySummaryOptions.on;
