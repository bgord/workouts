import * as bg from "@bgord/ui";
import * as ui from "../components";
import { BodyPartManage } from "../sections/body-part-manage";
import { BodyPartMeasurementExport } from "../sections/body-part-measurement-export";
import { BodyPartMeasurementImport } from "../sections/body-part-measurement-import";
import { BodyPartsEmpty } from "../sections/body-parts-empty";
import { BodyPartsOverview } from "../sections/body-parts-overview";

export function BodyParts() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.block}>
        <div data-main="between" data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/measurements">{t("app.measurements")}</ui.ButtonBack>

          <ui.Menu name="body-parts-menu">
            <ui.MenuTrigger />

            <ui.MenuContent>
              <BodyPartManage />

              <ui.MenuSeparator />

              <BodyPartMeasurementImport />

              <BodyPartMeasurementExport />
            </ui.MenuContent>
          </ui.Menu>
        </div>

        <h1>{t("measurements.body_parts.header")}</h1>
      </div>

      <div data-stack="y" {...ui.Gap.related}>
        <h2>{t("measurements.body_parts.latest")}</h2>

        <BodyPartsEmpty />

        <BodyPartsOverview />
      </div>
    </ui.Main>
  );
}
