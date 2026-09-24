import * as tools from "@bgord/tools";
import * as v from "valibot";
import { BodyWeightHistoryMonthAll } from "./body-weight-history-month.validation";

export const BodyWeightHistoryMonthError = { invalid: "body.weight.history.month.invalid" };

export const BodyWeightHistoryMonth = v.union(
  [v.literal(BodyWeightHistoryMonthAll), tools.MonthIsoId],
  BodyWeightHistoryMonthError.invalid,
);
export type BodyWeightHistoryMonthType = v.InferOutput<typeof BodyWeightHistoryMonth>;
