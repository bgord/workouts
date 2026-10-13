import { StepsChartGranularityOptions } from "../../modules/measurements/value-objects/steps-chart-granularity-options";

export const Form = {
  chart: { field: { name: "chart" } },
  default: { chart: undefined },
  isDefault: (search: { chart?: StepsChartGranularityOptions }): boolean =>
    search.chart === Form.default.chart,
  validate: (value: Record<string, unknown>): { chart?: StepsChartGranularityOptions } => ({
    chart: Object.values(StepsChartGranularityOptions).includes(
      value["chart"] as StepsChartGranularityOptions,
    )
      ? (value["chart"] as StepsChartGranularityOptions)
      : Form.default.chart,
  }),
};
