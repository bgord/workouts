import * as bg from "@bgord/ui";
import { Flag } from "lucide-react";
import type { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";
import { BodyWeightMeasurementCorrect } from "./body-weight-measurement-correct";
import { BodyWeightMeasurementRemove } from "./body-weight-measurement-remove";
import { BodyWeightReferenceSet } from "./body-weight-reference-set";

const date = { minWidth: 0 };
const first = { borderTopColor: "transparent" };
const day = bg.Rhythm(100).times(1).width;
const delta = bg.Rhythm(56).times(1).minWidth;

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
    <ui.HairlineRow
      data-cross="center"
      data-gap="3"
      data-md-gap="2"
      data-py="1"
      data-stack="x"
      data-wrap="nowrap"
      style={props.first ? first : undefined}
    >
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
            data-cursor="pointer"
            data-fs="sm"
            data-gap="2"
            data-grow="1"
            data-md-fs="xs"
            data-stack="x"
            data-transform="nowrap"
            onClick={bodyWeightMeasurementCorrect.enable}
            style={date}
            type="button"
          >
            <span data-shrink="0" data-transform="font-variant-numeric" style={day}>
              {DateFormat.day(language, Temporal.PlainDate.from(props.measurement.measuredOn))}
            </span>

            <span data-color="neutral-500">
              {DateFormat.weekday(language, Temporal.PlainDate.from(props.measurement.measuredOn))}
            </span>
          </button>

          <button
            data-color="neutral-100"
            data-cursor="pointer"
            data-fs="sm"
            data-fw="medium"
            data-md-fs="xs"
            data-shrink="0"
            data-transform="nowrap"
            onClick={bodyWeightMeasurementCorrect.enable}
            type="button"
          >
            {t("measurements.body_weight.value", {
              weight: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
            })}
          </button>

          <div data-fs="xs" data-main="end" data-shrink="0" data-stack="x" style={delta}>
            <ui.BodyWeightDelta
              current={props.measurement.weight}
              goal={props.goal}
              previous={props.previous?.weight}
            />
          </div>

          <div data-cross="center" data-gap="1" data-shrink="0" data-stack="x" data-wrap="nowrap">
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
