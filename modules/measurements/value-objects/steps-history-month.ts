import * as tools from "@bgord/tools";
import * as v from "valibot";
import { StepsHistoryMonthAll } from "./steps-history-month.validation";

export const StepsHistoryMonthError = { invalid: "steps.history.month.invalid" };

export const StepsHistoryMonth = v.union(
  [v.literal(StepsHistoryMonthAll), tools.MonthIsoId],
  StepsHistoryMonthError.invalid,
);
export type StepsHistoryMonthType = v.InferOutput<typeof StepsHistoryMonth>;
