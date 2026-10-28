import * as bg from "@bgord/ui";
import { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";

export const Form = {
  chart: { field: { name: "chart" } },
  ...bg.SearchParam.form({ chart: bg.SearchParam.oneOf(Object.values(BodyWeightChartGranularityOptions)) }),
};
