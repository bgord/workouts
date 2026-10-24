import type * as bg from "@bgord/bun";
import * as v from "valibot";
import { WeeklySummaryOptions } from "./weekly-summary-options";

export const WeeklySummaryError = { invalid: "weekly.summary.invalid" };

export const WeeklySummary = v.enum(WeeklySummaryOptions, WeeklySummaryError.invalid);
export type WeeklySummaryType = v.InferOutput<typeof WeeklySummary>;

export const WeeklySummaryDefault = WeeklySummaryOptions.on;

export const WeeklySummaryPreference = {
  key: "weekly_summary",
  field: "weeklySummary",
  schema: WeeklySummary,
  default: WeeklySummaryDefault,
} as const satisfies bg.Preferences.VO.PreferenceDefinitionType;
