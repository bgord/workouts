import * as bg from "@bgord/ui";
import { X } from "lucide-react";
import * as DailyStepsFiltersForm from "../../app/services/daily-steps-filters-form";
import type { DailyStepsHistoryMonthType } from "../../modules/measurements/value-objects/daily-steps-history-month";
import { DailyStepsHistoryMonthAll } from "../../modules/measurements/value-objects/daily-steps-history-month.validation";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

export function DailyStepsFilters() {
  const t = bg.useTranslations();
  const format = bg.useDateFormat();
  const { month, months } = dailyStepsRoute.useLoaderData();
  const navigate = dailyStepsRoute.useNavigate();
  const search = dailyStepsRoute.useSearch();

  const pristine = DailyStepsFiltersForm.Form.isDefault(search);

  return (
    <div data-stack="x" {...ui.Gap.cluster}>
      <ui.Select
        aria-label={t("measurements.daily_steps.history.month.label")}
        id={DailyStepsFiltersForm.Form.month.field.name}
        name={DailyStepsFiltersForm.Form.month.field.name}
        onChange={(event) =>
          navigate({
            resetScroll: false,
            search: { month: event.currentTarget.value as DailyStepsHistoryMonthType, chart: search.chart },
            to: "/measurements/daily-steps",
          })
        }
        value={month ?? ""}
        {...bg.Autocomplete.off}
      >
        <option value={DailyStepsHistoryMonthAll}>{t("measurements.daily_steps.history.month.all")}</option>
        {months.map((summary) => (
          <option key={summary.month} value={summary.month}>
            {format.month(`${summary.month}-01`)} ({summary.count})
          </option>
        ))}
      </ui.Select>

      <ui.IconButton
        aria-label={t("app.clear")}
        data-disp={pristine ? "none" : "flex"}
        data-md-disp="flex"
        disabled={pristine}
        onClick={() =>
          navigate({ resetScroll: false, search: { chart: search.chart }, to: "/measurements/daily-steps" })
        }
        title={t("app.clear")}
      >
        <X data-size="sm" />
      </ui.IconButton>
    </div>
  );
}
