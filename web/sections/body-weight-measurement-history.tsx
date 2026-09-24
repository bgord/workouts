import * as bg from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightMeasurementFilters } from "./body-weight-measurement-filters";
import { BodyWeightMeasurementList } from "./body-weight-measurement-list";
import { BodyWeightProgressChart } from "./body-weight-progress-chart";
import { BodyWeightStats } from "./body-weight-stats";

export function BodyWeightMeasurementHistory() {
  const t = bg.useTranslations();
  const { bodyWeightStats } = measurementsRoute.useLoaderData();

  if (!bodyWeightStats) return null;

  return (
    <div data-stack="y" {...ui.Gap.section}>
      <BodyWeightStats {...bodyWeightStats} />

      <BodyWeightProgressChart />

      <div data-stack="y" {...ui.Gap.related}>
        <div data-main="between" data-stack="x">
          <h2>{t("measurements.body_weight.history")}</h2>
          <BodyWeightMeasurementFilters />
        </div>

        <BodyWeightMeasurementList />
      </div>
    </div>
  );
}
