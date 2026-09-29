// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { MeasurementsTabOptions } from "../../app/services/measurements-tab-form";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightMeasure } from "../sections/body-weight-measure";
import { BodyWeightMeasurementExport } from "../sections/body-weight-measurement-export";
import { BodyWeightMeasurementHistory } from "../sections/body-weight-measurement-history";
import { BodyWeightMeasurementImport } from "../sections/body-weight-measurement-import";
import { BodyWeightMeasurementsEmpty } from "../sections/body-weight-measurements-empty";
import { MeasurementsTabs } from "../sections/measurements-tabs";

export function Measurements() {
  const t = bg.useTranslations();
  const search = measurementsRoute.useSearch();

  const bodyWeight = search.tab !== MeasurementsTabOptions.body_parts;

  return (
    <ui.Main>
      <div data-stack="x" {...ui.Gap.related}>
        <h1 data-grow="1">{t("app.measurements")}</h1>

        {bodyWeight && (
          <div data-stack="x" {...ui.Gap.inline}>
            <BodyWeightMeasurementImport />

            <BodyWeightMeasurementExport />
          </div>
        )}
      </div>

      <MeasurementsTabs />

      {bodyWeight && (
        <>
          <BodyWeightMeasure />

          <BodyWeightMeasurementsEmpty />

          <BodyWeightMeasurementHistory />
        </>
      )}
    </ui.Main>
  );
}
