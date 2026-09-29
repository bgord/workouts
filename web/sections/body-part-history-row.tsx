import * as bg from "@bgord/ui";
import type { BodyPartMeasurementWithDelta } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";
import { BodyPartMeasurementCorrect } from "./body-part-measurement-correct";
import { BodyPartMeasurementRemove } from "./body-part-measurement-remove";

export function BodyPartHistoryRow(props: { measurement: BodyPartMeasurementWithDelta; first: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const bodyPartMeasurementCorrect = bg.useToggle({ name: `correct-${props.measurement.id}` });

  return (
    <ui.HairlineRow
      data-cross="center"
      data-stack="x"
      first={props.first}
      tone="subtle"
      {...ui.Spacing.rowCompact}
    >
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
            <span data-color="neutral-300" data-fs="sm" data-grow="1" data-transform="nowrap">
              {DateFormat.plainDay(language, props.measurement.measuredOn)}
            </span>

            <ui.LengthDelta data-fs="xs" millimeters={props.measurement.delta} />

            <span
              data-color="neutral-0"
              data-fw="medium"
              data-shrink="0"
              data-transform="font-variant-numeric"
              {...bg.Rhythm(72).times(1).style.minWidth}
              style={{ textAlign: "right" }}
            >
              {t("measurements.body_parts.value", {
                value: LengthFormat.centimeters(props.measurement.value).toFixed(1),
              })}
            </span>
          </button>

          <BodyPartMeasurementRemove measurement={props.measurement} />
        </>
      )}
    </ui.HairlineRow>
  );
}
