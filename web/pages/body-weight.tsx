import * as bg from "@bgord/ui";
import * as ui from "../components";
import { BodyWeightMeasure } from "../sections/body-weight-measure";
import { BodyWeightMeasurementExport } from "../sections/body-weight-measurement-export";
import { BodyWeightMeasurementHistory } from "../sections/body-weight-measurement-history";
import { BodyWeightMeasurementImport } from "../sections/body-weight-measurement-import";
import { BodyWeightMeasurementsEmpty } from "../sections/body-weight-measurements-empty";

export function BodyWeight() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.ButtonBack to="/measurements" />

        <h1 data-grow="1" data-md-transform="center" data-minw="0">
          {t("measurements.body_weight.header")}
        </h1>

        <bg.Menu name="body-weight-menu">
          <ui.MenuTrigger />

          <bg.MenuContent>
            <BodyWeightMeasurementImport />

            <BodyWeightMeasurementExport />
          </bg.MenuContent>
        </bg.Menu>
      </div>

      <BodyWeightMeasure />

      <BodyWeightMeasurementsEmpty />

      <BodyWeightMeasurementHistory />
    </ui.Main>
  );
}
