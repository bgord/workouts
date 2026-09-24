import * as tools from "@bgord/tools";
import * as v from "valibot";

export const BodyWeightHistoryMonthAll = "all";

export const BodyWeightHistoryMonthError = { invalid: "body.weight.history.month.invalid" };

export const BodyWeightHistoryMonth = v.union(
  [v.literal(BodyWeightHistoryMonthAll), tools.MonthIsoId],
  BodyWeightHistoryMonthError.invalid,
);
export type BodyWeightHistoryMonthType = v.InferOutput<typeof BodyWeightHistoryMonth>;
