import * as bg from "@bgord/ui";
import type { BodyPartSummaryMeasurement } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { BodyPartMeasurementCorrect } from "./body-part-measurement-correct";
import { BodyPartMeasurementRemove } from "./body-part-measurement-remove";

export function BodyPartHistoryRow(props: {
  measurement: BodyPartSummaryMeasurement;
  previous: BodyPartSummaryMeasurement | undefined;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const bodyPartMeasurementCorrect = bg.useToggle({ name: `correct-${props.measurement.id}` });

  return (
    <ui.HairlineRow data-cross="center" data-stack="x" tone="subtle" {...ui.Spacing.rowCompact}>
      {bodyPartMeasurementCorrect.on && (
        <BodyPartMeasurementCorrect measurement={props.measurement} {...bodyPartMeasurementCorrect} />
      )}

      {bodyPartMeasurementCorrect.off && (
        <>
          <button
            data-cross="center"
            data-cursor="pointer"
            data-grow="1"
            data-minw="0"
            data-stack="x"
            onClick={bodyPartMeasurementCorrect.enable}
            title={t("measurements.body_parts.correct.title")}
            type="button"
            {...ui.Gap.cluster}
            {...bodyPartMeasurementCorrect.props.controller}
          >
            <span data-color="neutral-300" data-grow="1" data-md-fs="xs" data-transform="nowrap">
              {DateFormat.plainDay(language, props.measurement.measuredOn)}
            </span>

            <span
              data-fs="xs"
              data-main="end"
              data-shrink="0"
              data-stack="x"
              {...bg.Rhythm(56).times(1).style.minWidth}
            >
              <ui.LengthDelta current={props.measurement.value} previous={props.previous?.value} />
            </span>

            <span
              data-color="neutral-100"
              data-fw="medium"
              data-main="end"
              data-md-fs="xs"
              data-shrink="0"
              data-stack="x"
              data-transform="font-variant-numeric"
              {...bg.Rhythm(72).times(1).style.minWidth}
            >
              <ui.LengthValue millimeters={props.measurement.value} />
            </span>
          </button>

          <BodyPartMeasurementRemove measurement={props.measurement} />
        </>
      )}
    </ui.HairlineRow>
  );
}
