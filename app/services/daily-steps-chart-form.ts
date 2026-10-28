import * as bg from "@bgord/ui";
import { DailyStepsChartGranularityOptions } from "../../modules/measurements/value-objects/daily-steps-chart-granularity-options";

export const Form = {
  chart: { field: { name: "chart" } },
  ...bg.SearchParam.form({ chart: bg.SearchParam.oneOf(Object.values(DailyStepsChartGranularityOptions)) }),
};
