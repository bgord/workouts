// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import * as Sections from "../sections";

export function Measurements() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("measurements.body_weight.header")}</ui.Header>

        <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
          <Sections.BodyWeightMeasurementImport />

          <Sections.BodyWeightMeasurementExport />
        </div>
      </div>

      <Sections.BodyWeightMeasure />

      <Sections.BodyWeightMeasurementsEmpty />

      <Sections.BodyWeightMeasurementHistory />
    </ui.Main>
  );
}
