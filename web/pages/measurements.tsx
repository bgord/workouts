// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { BodyWeightMeasure } from "../sections/body-weight-measure";
import { BodyWeightMeasurementExport } from "../sections/body-weight-measurement-export";
import { BodyWeightMeasurementHistory } from "../sections/body-weight-measurement-history";
import { BodyWeightMeasurementImport } from "../sections/body-weight-measurement-import";
import { BodyWeightMeasurementsEmpty } from "../sections/body-weight-measurements-empty";

export function Measurements() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("measurements.body_weight.header")}</ui.Header>

        <div data-stack="x" {...ui.Gap.inline}>
          <BodyWeightMeasurementImport />

          <BodyWeightMeasurementExport />
        </div>
      </div>

      <BodyWeightMeasure />

      <BodyWeightMeasurementsEmpty />

      <BodyWeightMeasurementHistory />
    </ui.Main>
  );
}
