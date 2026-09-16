import * as bg from "@bgord/ui";
import { Flag } from "lucide-react";
import type { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { BodyWeightDelta } from "../components/body-weight-delta";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";
import { BodyWeightMeasurementCorrect } from "./body-weight-measurement-correct";
import { BodyWeightMeasurementRemove } from "./body-weight-measurement-remove";
import { BodyWeightReferenceSet } from "./body-weight-reference-set";

const date = { minWidth: 0 };
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
  const edit = bg.useToggle({ name: `correct-${props.measurement.id}` });
  const reference = bg.useToggle({ name: `reference-${props.measurement.id}` });
  const open = edit.on || reference.on;

  return (
    <li
      data-bct={props.first ? undefined : "alpha-soft"}
      data-bst={props.first ? undefined : "solid"}
      data-bwt={props.first ? undefined : "hairline"}
      data-cross="center"
      data-gap="3"
      data-md-gap="2"
      data-py="1"
      data-stack="x"
      data-wrap="nowrap"
    >
      {open && (
        <>
          <BodyWeightMeasurementCorrect measurement={props.measurement} toggle={edit} />
          <BodyWeightReferenceSet measurement={props.measurement} toggle={reference} />
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
            onClick={edit.enable}
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
            onClick={edit.enable}
            type="button"
          >
            {t("measurements.body_weight.value", {
              weight: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
            })}
          </button>

          <div data-fs="xs" data-main="end" data-shrink="0" data-stack="x" style={delta}>
            <BodyWeightDelta
              current={props.measurement.weight}
              goal={props.goal}
              previous={props.previous?.weight}
            />
          </div>

          <div data-cross="center" data-gap="1" data-shrink="0" data-stack="x" data-wrap="nowrap">
            <button
              className="c-button"
              data-color={props.measurement.reference ? "brand-400" : "neutral-500"}
              data-hover-color="brand-300"
              data-px="0"
              data-variant="ghost"
              onClick={reference.enable}
              title={t("measurements.body_weight.reference.title")}
              type="button"
              {...bg.Rhythm().times(3).style.width}
              {...reference.props.controller}
            >
              <Flag data-size="sm" fill={props.measurement.reference ? "currentColor" : "none"} />
            </button>

            <BodyWeightMeasurementRemove measurement={props.measurement} />
          </div>
        </>
      )}
    </li>
  );
}
