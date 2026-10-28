import type * as tools from "@bgord/tools";
import * as bg from "@bgord/ui";
import { BodyWeightHistoryMonthAll } from "../../modules/measurements/value-objects/body-weight-history-month.validation";

export const Form = {
  month: { field: { name: "month" } },
  ...bg.SearchParam.form({
    month: bg.SearchParam.or<typeof BodyWeightHistoryMonthAll, tools.MonthIsoIdType>(
      bg.SearchParam.oneOf([BodyWeightHistoryMonthAll]),
      bg.SearchParam.matches<tools.MonthIsoIdType>(/^\d{4}-(0[1-9]|1[0-2])$/),
    ),
  }),
};
