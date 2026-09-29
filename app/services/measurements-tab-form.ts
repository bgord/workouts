export enum MeasurementsTabOptions {
  body_weight = "body_weight",
  body_parts = "body_parts",
}

export const Form = {
  tab: { field: { name: "tab" } },
  default: { tab: undefined },
  validate: (value: Record<string, unknown>): { tab?: MeasurementsTabOptions } => ({
    tab: Object.values(MeasurementsTabOptions).includes(value["tab"] as MeasurementsTabOptions)
      ? (value["tab"] as MeasurementsTabOptions)
      : Form.default.tab,
  }),
};
