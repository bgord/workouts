import * as bg from "@bgord/ui";
import { Flag } from "lucide-react";
import type { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals } from "../services/weight-format";
import { BodyWeightMeasurementCorrect } from "./body-weight-measurement-correct";
import { BodyWeightMeasurementRemove } from "./body-weight-measurement-remove";
import { BodyWeightReferenceSet } from "./body-weight-reference-set";

export function BodyWeightMeasurementRow(props: {
  measurement: BodyWeightMeasurement;
  previous: BodyWeightMeasurement | undefined;
  goal: BodyWeightGoalOptions | undefined;
  first: boolean;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const bodyWeightMeasurementCorrect = bg.useToggle({ name: `correct-${props.measurement.id}` });
  const bodyWeightReference = bg.useToggle({ name: `reference-${props.measurement.id}` });

  const open = bodyWeightMeasurementCorrect.on || bodyWeightReference.on;

  return (
    <ui.HairlineRow data-md-gap="2" data-stack="x" first={props.first} {...ui.Spacing.rowCompact}>
      {open && (
        <>
          <BodyWeightMeasurementCorrect measurement={props.measurement} {...bodyWeightMeasurementCorrect} />
          <BodyWeightReferenceSet measurement={props.measurement} {...bodyWeightReference} />
        </>
      )}

      {!open && (
        <>
          <button
            data-color="neutral-300"
            data-cross="stretch"
            data-cursor="pointer"
            data-grow="1"
            data-md-fs="xs"
            data-minw="0"
            data-stack="x"
            data-transform="nowrap"
            data-wrap="wrap"
            onClick={bodyWeightMeasurementCorrect.enable}
            type="button"
            {...ui.Gap.inline}
          >
            <span
              data-shrink="0"
              data-transform="font-variant-numeric"
              {...bg.Rhythm(100).times(1).style.width}
            >
              {DateFormat.day(language, props.measurement.measuredOn)}
            </span>

            <small>{DateFormat.weekday(language, props.measurement.measuredOn)}</small>
          </button>

          <button
            data-color="neutral-100"
            data-cursor="pointer"
            data-fw="medium"
            data-md-fs="xs"
            data-shrink="0"
            data-transform="nowrap"
            onClick={bodyWeightMeasurementCorrect.enable}
            type="button"
          >
            <ui.BodyWeightValue weight={props.measurement.weight} />
          </button>

          <div
            data-fs="xs"
            data-main="end"
            data-shrink="0"
            data-stack="x"
            {...bg.Rhythm(56).times(1).style.minWidth}
          >
            <ui.WeightDelta
              current={props.measurement.weight}
              decimals={BodyWeightDecimals}
              goal={props.goal}
              previous={props.previous?.weight}
            />
          </div>

          <div data-shrink="0" data-stack="x" {...ui.Gap.inline}>
            <ui.IconButton
              onClick={bodyWeightReference.enable}
              title={t("measurements.body_weight.reference.title")}
              tone={props.measurement.reference ? "brand" : "neutral"}
              {...bodyWeightReference.props.controller}
            >
              <Flag data-size="sm" fill={props.measurement.reference ? "currentColor" : "none"} />
            </ui.IconButton>

            <BodyWeightMeasurementRemove measurement={props.measurement} />
          </div>
        </>
      )}
    </ui.HairlineRow>
  );
}
