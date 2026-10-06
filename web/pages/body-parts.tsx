import * as bg from "@bgord/ui";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { BodyPartManage } from "../sections/body-part-manage";
import { BodyPartMeasurementExport } from "../sections/body-part-measurement-export";
import { BodyPartMeasurementImport } from "../sections/body-part-measurement-import";
import { BodyPartsEmpty } from "../sections/body-parts-empty";
import { BodyPartsOverview } from "../sections/body-parts-overview";

export function BodyParts() {
  const t = bg.useTranslations();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  const exportable = bodyParts.data.some((bodyPart) => bodyPart.measurements.length > 0);

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.ButtonBack to="/measurements" />

        <h1 data-grow="1" data-md-transform="center" data-minw="0">
          {t("measurements.body_parts.header")}
        </h1>

        <bg.Menu name="body-parts-menu">
          <ui.MenuTrigger />

          <bg.MenuContent>
            <BodyPartManage />

            {exportable && <bg.MenuSeparator />}

            <BodyPartMeasurementImport />

            <BodyPartMeasurementExport />
          </bg.MenuContent>
        </bg.Menu>
      </div>

      <div data-stack="y" {...ui.Gap.related}>
        <BodyPartsEmpty />

        <BodyPartsOverview />
      </div>
    </ui.Main>
  );
}
