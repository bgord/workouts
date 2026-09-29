// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { BodyPartManage } from "../sections/body-part-manage";
import { BodyPartMeasure } from "../sections/body-part-measure";
import { BodyPartMeasurementExport } from "../sections/body-part-measurement-export";
import { BodyPartMeasurementImport } from "../sections/body-part-measurement-import";
import { BodyPartsEmpty } from "../sections/body-parts-empty";
import { BodyPartsOverview } from "../sections/body-parts-overview";

export function BodyParts() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="x" {...ui.Gap.related}>
        <ui.ButtonBack to="/measurements" />

        <h1 data-grow="1">{t("measurements.body_parts.header")}</h1>

        <div data-stack="x" {...ui.Gap.inline}>
          <BodyPartMeasurementImport />

          <BodyPartMeasurementExport />
        </div>
      </div>

      <div data-cross="center" data-stack="x" {...ui.Gap.inline}>
        <BodyPartMeasure />
        <BodyPartManage />
      </div>

      <BodyPartsEmpty />

      <BodyPartsOverview />
    </ui.Main>
  );
}
