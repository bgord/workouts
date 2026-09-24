import * as bg from "@bgord/ui";
import { X } from "lucide-react";
import * as BodyWeightMeasurementFiltersForm from "../../app/services/body-weight-measurement-filters-form";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import { BodyWeightHistoryMonthAll } from "../../modules/measurements/value-objects/body-weight-history-month.validation";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";

export function BodyWeightMeasurementFilters() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { month, months } = measurementsRoute.useLoaderData();
  const navigate = measurementsRoute.useNavigate();
  const search = measurementsRoute.useSearch();

  return (
    <div data-stack="x" {...ui.Gap.cluster}>
      <div data-md-grow="1">
        <ui.Select
          aria-label={t("measurements.body_weight.history.month.label")}
          id={BodyWeightMeasurementFiltersForm.Form.month.field.name}
          name={BodyWeightMeasurementFiltersForm.Form.month.field.name}
          onChange={(event) =>
            navigate({
              resetScroll: false,
              search: {
                month: event.currentTarget.value as BodyWeightHistoryMonthType,
                chart: search.chart,
              },
              to: "/measurements",
            })
          }
          value={month ?? ""}
          {...bg.Autocomplete.off}
        >
          <option value={BodyWeightHistoryMonthAll}>{t("measurements.body_weight.history.month.all")}</option>
          {months.map((summary) => (
            <option key={summary.month} value={summary.month}>
              {DateFormat.month(language, `${summary.month}-01`)} ({summary.count})
            </option>
          ))}
        </ui.Select>
      </div>

      {!BodyWeightMeasurementFiltersForm.Form.isDefault(search) && (
        <ui.IconButton
          aria-label={t("app.clear")}
          onClick={() =>
            navigate({
              resetScroll: false,
              search: { chart: search.chart },
              to: "/measurements",
            })
          }
          title={t("app.clear")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      )}
    </div>
  );
}
