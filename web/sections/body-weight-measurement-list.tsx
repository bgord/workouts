import * as bg from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightMeasurementFilters } from "./body-weight-measurement-filters";
import { BodyWeightMeasurementRow } from "./body-weight-measurement-row";

const VISIBLE = 15;

export function BodyWeightMeasurementList() {
  const t = bg.useTranslations();
  const { measurements } = measurementsRoute.useLoaderData();
  const search = measurementsRoute.useSearch();

  const all = bg.useToggle({ name: "body-weight-measurement-list-all" });

  const filtered = measurements.filter((measurement) =>
    measurement.measuredOn.startsWith(search.month ?? ""),
  );
  const visible = search.month || all.on ? filtered : filtered.slice(0, VISIBLE);
  const hidden = filtered.length - visible.length;

  return (
    <div data-stack="y" {...ui.Gap.block}>
      <BodyWeightMeasurementFilters />

      <ul data-stack="y">
        {visible.map((measurement, index) => (
          <BodyWeightMeasurementRow
            first={index === 0}
            goal={measurements.find((measurement) => measurement.reference)?.goal}
            key={measurement.id}
            measurement={measurement}
            previous={measurements[measurements.indexOf(measurement) + 1]}
          />
        ))}
      </ul>

      {(hidden > 0 || all.on) && (
        <ui.ShowMoreLink
          less={t("measurements.body_weight.history.less")}
          more={t("measurements.body_weight.history.more", { count: hidden })}
          {...all}
        />
      )}
    </div>
  );
}
