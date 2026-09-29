// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { MeasurementsTabOptions } from "../../app/services/measurements-tab-form";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyPartManage } from "../sections/body-part-manage";
import { BodyPartMeasure } from "../sections/body-part-measure";
import { BodyPartMeasurementExport } from "../sections/body-part-measurement-export";
import { BodyPartMeasurementImport } from "../sections/body-part-measurement-import";
import { BodyPartsEmpty } from "../sections/body-parts-empty";
import { BodyPartsOverview } from "../sections/body-parts-overview";
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
      <h1>{t("app.measurements")}</h1>

      <div data-cross="center" data-main="between" data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
        <MeasurementsTabs />

        {bodyWeight && (
          <div data-cross="center" data-ml="auto" data-stack="x" {...ui.Gap.inline}>
            <BodyWeightMeasurementImport />

            <BodyWeightMeasurementExport />
          </div>
        )}

        {!bodyWeight && (
          <div data-cross="center" data-ml="auto" data-stack="x" {...ui.Gap.inline}>
            <BodyPartManage />

            <BodyPartMeasurementImport />

            <BodyPartMeasurementExport />

            <BodyPartMeasure />
          </div>
        )}
      </div>

      {!bodyWeight && <BodyPartsEmpty />}

      {!bodyWeight && <BodyPartsOverview />}

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
