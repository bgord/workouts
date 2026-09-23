import * as bg from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightMeasurementList } from "./body-weight-measurement-list";
import { BodyWeightProgressChart } from "./body-weight-progress-chart";
import { BodyWeightStats } from "./body-weight-stats";

export function BodyWeightMeasurementHistory() {
  const t = bg.useTranslations();
  const { measurements, bodyWeightStats } = measurementsRoute.useLoaderData();

  if (measurements.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.section}>
      {bodyWeightStats && <BodyWeightStats {...bodyWeightStats} />}

      <BodyWeightProgressChart />

      <div data-stack="y" {...ui.Gap.related}>
        <h2>{t("measurements.body_weight.history")}</h2>

        <BodyWeightMeasurementList />
      </div>
    </div>
  );
}
