import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import { BodyWeightHistoryMonthAll } from "../../modules/measurements/value-objects/body-weight-history-month.validation";

export const Form = {
  month: { field: { name: "month" } },
  default: { month: undefined },
  isDefault: (search: { month?: BodyWeightHistoryMonthType }): boolean => search.month === Form.default.month,
  validate: (value: Record<string, unknown>): { month?: BodyWeightHistoryMonthType } => ({
    month:
      typeof value["month"] === "string" &&
      (value["month"] === BodyWeightHistoryMonthAll || /^\d{4}-(0[1-9]|1[0-2])$/.test(value["month"]))
        ? (value["month"] as BodyWeightHistoryMonthType)
        : Form.default.month,
  }),
};
