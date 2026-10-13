import * as v from "valibot";
import { StepsChartGranularityOptions } from "./steps-chart-granularity-options";

export const StepsChartGranularityError = { invalid: "steps.chart.granularity.invalid" };

export const StepsChartGranularity = v.enum(StepsChartGranularityOptions, StepsChartGranularityError.invalid);
export type StepsChartGranularityType = v.InferOutput<typeof StepsChartGranularity>;
