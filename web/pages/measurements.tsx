// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Scale } from "lucide-react";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import {
  BodyWeightMeasure,
  BodyWeightMeasurementExport,
  BodyWeightMeasurementImport,
  BodyWeightMeasurementList,
  BodyWeightProgressChart,
  BodyWeightStats,
} from "../sections";

export function Measurements() {
  const t = bg.useTranslations();
  const { measurements } = measurementsRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("measurements.body_weight.header")}</ui.Header>

        <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
          <BodyWeightMeasurementImport />

          <BodyWeightMeasurementExport />
        </div>
      </div>

      <BodyWeightMeasure />

      {measurements.length === 0 && (
        <ui.EmptyState>
          <ui.EmptyStateIcon icon={Scale} />

          <ui.EmptyStateMessage>{t("measurements.body_weight.empty")}</ui.EmptyStateMessage>

          <ui.Meta>{t("measurements.body_weight.empty.hint")}</ui.Meta>
        </ui.EmptyState>
      )}

      {measurements.length > 0 && (
        <div data-stack="y" {...ui.Gap.section}>
          <BodyWeightStats measurements={measurements} />

          <BodyWeightProgressChart measurements={measurements} />

          <div data-stack="y" {...ui.Gap.related}>
            <ui.SectionHeading>{t("measurements.body_weight.history")}</ui.SectionHeading>

            <BodyWeightMeasurementList measurements={measurements} />
          </div>
        </div>
      )}
    </ui.Main>
  );
}
