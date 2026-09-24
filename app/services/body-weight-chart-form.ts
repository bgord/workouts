import { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";

export const Form = {
  chart: { field: { name: "chart" } },
  default: { chart: undefined },
  validate: (value: Record<string, unknown>): { chart?: BodyWeightChartGranularityOptions } => ({
    chart: Object.values(BodyWeightChartGranularityOptions).includes(
      value["chart"] as BodyWeightChartGranularityOptions,
    )
      ? (value["chart"] as BodyWeightChartGranularityOptions)
      : Form.default.chart,
  }),
};
