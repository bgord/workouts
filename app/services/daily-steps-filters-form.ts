import type { DailyStepsHistoryMonthType } from "../../modules/measurements/value-objects/daily-steps-history-month";
import { DailyStepsHistoryMonthAll } from "../../modules/measurements/value-objects/daily-steps-history-month.validation";

export const Form = {
  month: { field: { name: "month" } },
  default: { month: undefined },
  isDefault: (search: { month?: DailyStepsHistoryMonthType }): boolean => search.month === Form.default.month,
  validate: (value: Record<string, unknown>): { month?: DailyStepsHistoryMonthType } => ({
    month:
      typeof value["month"] === "string" &&
      (value["month"] === DailyStepsHistoryMonthAll || /^\d{4}-(0[1-9]|1[0-2])$/.test(value["month"]))
        ? (value["month"] as DailyStepsHistoryMonthType)
        : Form.default.month,
  }),
};
