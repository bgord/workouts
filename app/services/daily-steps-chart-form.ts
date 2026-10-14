import { DailyStepsChartGranularityOptions } from "../../modules/measurements/value-objects/daily-steps-chart-granularity-options";

export const Form = {
  chart: { field: { name: "chart" } },
  default: { chart: undefined },
  isDefault: (search: { chart?: DailyStepsChartGranularityOptions }): boolean =>
    search.chart === Form.default.chart,
  validate: (value: Record<string, unknown>): { chart?: DailyStepsChartGranularityOptions } => ({
    chart: Object.values(DailyStepsChartGranularityOptions).includes(
      value["chart"] as DailyStepsChartGranularityOptions,
    )
      ? (value["chart"] as DailyStepsChartGranularityOptions)
      : Form.default.chart,
  }),
};
