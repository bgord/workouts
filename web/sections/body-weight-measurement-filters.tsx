import * as bg from "@bgord/ui";
import { X } from "lucide-react";
import * as BodyWeightMeasurementFiltersForm from "../../app/services/body-weight-measurement-filters-form";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import { BodyWeightHistoryMonthAll } from "../../modules/measurements/value-objects/body-weight-history-month.validation";
import * as ui from "../components";
import { useDateFormat } from "../hooks/use-date-format";
import { bodyWeightRoute } from "../router";

export function BodyWeightMeasurementFilters() {
  const t = bg.useTranslations();
  const format = useDateFormat();
  const { month, months } = bodyWeightRoute.useLoaderData();
  const navigate = bodyWeightRoute.useNavigate();
  const search = bodyWeightRoute.useSearch();

  const pristine = BodyWeightMeasurementFiltersForm.Form.isDefault(search);

  return (
    <div data-stack="x" {...ui.Gap.cluster}>
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
            to: "/measurements/body-weight",
          })
        }
        value={month ?? ""}
        {...bg.Autocomplete.off}
      >
        <option value={BodyWeightHistoryMonthAll}>{t("measurements.body_weight.history.month.all")}</option>
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
          navigate({
            resetScroll: false,
            search: { chart: search.chart },
            to: "/measurements/body-weight",
          })
        }
        title={t("app.clear")}
      >
        <X data-size="sm" />
      </ui.IconButton>
    </div>
  );
}
