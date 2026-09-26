import * as v from "valibot";
import { BodyPartChartGranularityOptions } from "./body-part-chart-granularity-options";

export const BodyPartChartGranularityError = { invalid: "body.part.chart.granularity.invalid" };

export const BodyPartChartGranularity = v.enum(
  BodyPartChartGranularityOptions,
  BodyPartChartGranularityError.invalid,
);
export type BodyPartChartGranularityType = v.InferOutput<typeof BodyPartChartGranularity>;
