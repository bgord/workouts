// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Download, Scale, Upload } from "lucide-react";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import {
  BodyWeightMeasure,
  BodyWeightMeasurementImport,
  BodyWeightMeasurementList,
  BodyWeightProgressChart,
  BodyWeightStats,
} from "../sections";

export function Measurements() {
  const t = bg.useTranslations();
  const { measurements } = measurementsRoute.useLoaderData();

  const bodyWeightMeasurementImport = bg.useToggle({ name: "body-weight-measurement-import" });

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Spacing.related}>
        <ui.Header data-grow="1">{t("measurements.body_weight.header")}</ui.Header>

        <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Spacing.inline}>
          <ui.IconButton
            onClick={bodyWeightMeasurementImport.enable}
            {...bodyWeightMeasurementImport.props.controller}
          >
            <Upload data-size="sm" />
          </ui.IconButton>

          {measurements.length > 0 && (
            <a
              className="c-button"
              data-color="neutral-400"
              data-hover-color="neutral-0"
              data-px="0"
              data-variant="ghost"
              download
              href="/api/measurements/body-weight/export"
              rel="noopener"
              target="_blank"
              {...bg.Rhythm().times(3).style.width}
            >
              <Download data-size="sm" />
            </a>
          )}
        </div>
      </div>

      <BodyWeightMeasurementImport {...bodyWeightMeasurementImport} />

      <BodyWeightMeasure />

      {measurements.length === 0 && (
        <ui.EmptyState>
          <ui.EmptyStateIcon icon={Scale} />

          <ui.EmptyStateMessage>{t("measurements.body_weight.empty")}</ui.EmptyStateMessage>

          <ui.Meta>{t("measurements.body_weight.empty.hint")}</ui.Meta>
        </ui.EmptyState>
      )}

      {measurements.length > 0 && (
        <div data-stack="y" {...ui.Spacing.section}>
          <BodyWeightStats measurements={measurements} />

          <BodyWeightProgressChart measurements={measurements} />

          <div data-stack="y" {...ui.Spacing.related}>
            <ui.SectionHeading>{t("measurements.body_weight.history")}</ui.SectionHeading>

            <BodyWeightMeasurementList measurements={measurements} />
          </div>
        </div>
      )}
    </ui.Main>
  );
}
