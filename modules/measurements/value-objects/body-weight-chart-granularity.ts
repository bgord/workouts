import * as v from "valibot";
import { BodyWeightChartGranularityOptions } from "./body-weight-chart-granularity-options";

export const BodyWeightChartGranularityError = { invalid: "body.weight.chart.granularity.invalid" };

export const BodyWeightChartGranularity = v.enum(
  BodyWeightChartGranularityOptions,
  BodyWeightChartGranularityError.invalid,
);
export type BodyWeightChartGranularityType = v.InferOutput<typeof BodyWeightChartGranularity>;
