import * as bg from "@bgord/ui";
import { X } from "lucide-react";
import * as BodyWeightMeasurementFiltersForm from "../../app/services/body-weight-measurement-filters-form";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";

export function BodyWeightMeasurementFilters() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { measurements } = measurementsRoute.useLoaderData();
  const navigate = measurementsRoute.useNavigate();
  const search = measurementsRoute.useSearch();

  const months = [...new Set(measurements.map((measurement) => measurement.measuredOn.slice(0, 7)))];

  return (
    <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
      <div data-md-grow="1">
        <ui.Select
          aria-label={t("measurements.body_weight.history.month.label")}
          id={BodyWeightMeasurementFiltersForm.Form.month.field.name}
          name={BodyWeightMeasurementFiltersForm.Form.month.field.name}
          onChange={(event) =>
            navigate({
              resetScroll: false,
              search: { month: event.currentTarget.value || undefined },
              to: "/measurements",
            })
          }
          value={search.month ?? ""}
          {...bg.Autocomplete.off}
        >
          <option value="">{t("measurements.body_weight.history.month.all")}</option>
          {months.map((value) => (
            <option key={value} value={value}>
              {DateFormat.month(language, `${value}-01`)} (
              {measurements.filter((measurement) => measurement.measuredOn.startsWith(value)).length})
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
              search: BodyWeightMeasurementFiltersForm.Form.default,
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
