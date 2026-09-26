import * as tools from "@bgord/tools";
import * as v from "valibot";
import { BodyPartHistoryMonthAll } from "./body-part-history-month.validation";

export const BodyPartHistoryMonthError = { invalid: "body.part.history.month.invalid" };

export const BodyPartHistoryMonth = v.union(
  [v.literal(BodyPartHistoryMonthAll), tools.MonthIsoId],
  BodyPartHistoryMonthError.invalid,
);
export type BodyPartHistoryMonthType = v.InferOutput<typeof BodyPartHistoryMonth>;
