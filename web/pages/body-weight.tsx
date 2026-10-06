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
      <div data-stack="y" {...ui.Gap.block}>
        <div data-main="between" data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/measurements">{t("app.measurements")}</ui.ButtonBack>

          <ui.Menu name="body-weight-menu">
            <ui.MenuTrigger />

            <ui.MenuContent>
              <BodyWeightMeasurementImport />

              <BodyWeightMeasurementExport />
            </ui.MenuContent>
          </ui.Menu>
        </div>

        <h1>{t("measurements.body_weight.header")}</h1>
      </div>

      <BodyWeightMeasure />

      <BodyWeightMeasurementsEmpty />

      <BodyWeightMeasurementHistory />
    </ui.Main>
  );
}
