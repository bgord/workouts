import type * as tools from "@bgord/tools";
import * as bg from "@bgord/ui";
import { DailyStepsHistoryMonthAll } from "../../modules/measurements/value-objects/daily-steps-history-month.validation";

export const Form = {
  month: { field: { name: "month" } },
  ...bg.SearchParam.form({
    month: bg.SearchParam.or<typeof DailyStepsHistoryMonthAll, tools.MonthIsoIdType>(
      bg.SearchParam.oneOf([DailyStepsHistoryMonthAll]),
      bg.SearchParam.matches<tools.MonthIsoIdType>(/^\d{4}-(0[1-9]|1[0-2])$/),
    ),
  }),
};
