import * as bg from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightMeasurementList } from "./body-weight-measurement-list";
import { BodyWeightProgressChart } from "./body-weight-progress-chart";
import { BodyWeightStats } from "./body-weight-stats";

export function BodyWeightMeasurementHistory() {
  const t = bg.useTranslations();
  const { measurements } = measurementsRoute.useLoaderData();

  if (measurements.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.section}>
      <BodyWeightStats measurements={measurements} />

      <BodyWeightProgressChart />

      <div data-stack="y" {...ui.Gap.related}>
        <ui.SectionHeading>{t("measurements.body_weight.history")}</ui.SectionHeading>

        <BodyWeightMeasurementList />
      </div>
    </div>
  );
}
