import * as v from "valibot";
import { DailyStepsChartGranularityOptions } from "./daily-steps-chart-granularity-options";

export const DailyStepsChartGranularityError = { invalid: "daily.steps.chart.granularity.invalid" };

export const DailyStepsChartGranularity = v.enum(
  DailyStepsChartGranularityOptions,
  DailyStepsChartGranularityError.invalid,
);
export type DailyStepsChartGranularityType = v.InferOutput<typeof DailyStepsChartGranularity>;
