import * as tools from "@bgord/tools";
import * as v from "valibot";
import { DailyStepsHistoryMonthAll } from "./daily-steps-history-month.validation";

export const DailyStepsHistoryMonthError = { invalid: "daily.steps.history.month.invalid" };

export const DailyStepsHistoryMonth = v.union(
  [v.literal(DailyStepsHistoryMonthAll), tools.MonthIsoId],
  DailyStepsHistoryMonthError.invalid,
);
export type DailyStepsHistoryMonthType = v.InferOutput<typeof DailyStepsHistoryMonth>;
