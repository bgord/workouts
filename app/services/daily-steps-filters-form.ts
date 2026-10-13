import type { StepsHistoryMonthType } from "../../modules/measurements/value-objects/steps-history-month";
import { StepsHistoryMonthAll } from "../../modules/measurements/value-objects/steps-history-month.validation";

export const Form = {
  month: { field: { name: "month" } },
  default: { month: undefined },
  isDefault: (search: { month?: StepsHistoryMonthType }): boolean => search.month === Form.default.month,
  validate: (value: Record<string, unknown>): { month?: StepsHistoryMonthType } => ({
    month:
      typeof value["month"] === "string" &&
      (value["month"] === StepsHistoryMonthAll || /^\d{4}-(0[1-9]|1[0-2])$/.test(value["month"]))
        ? (value["month"] as StepsHistoryMonthType)
        : Form.default.month,
  }),
};
