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

export function BodyWeightMeasurementRow(props: {
  measurement: BodyWeightMeasurement;
  previous: BodyWeightMeasurement | undefined;
  goal: BodyWeightGoalOptions | undefined;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const edit = bg.useToggle({ name: `correct-${props.measurement.id}` });
  const reference = bg.useToggle({ name: `reference-${props.measurement.id}` });
  const open = edit.on || reference.on;

  return (
    <tr data-hover-bg="alpha-subtle">
      {open && (
        <td colSpan={4} data-px="0" data-py="1-5">
          <BodyWeightMeasurementCorrect measurement={props.measurement} toggle={edit} />
          <BodyWeightReferenceSet measurement={props.measurement} toggle={reference} />
        </td>
      )}

      {!open && (
        <td data-md-pr="1" data-pl="0" data-pr="1-5" data-py="1-5" data-width="100%">
          <button
            data-color="neutral-200"
            data-cursor="pointer"
            data-fs="sm"
            data-fw="medium"
            data-gap="2"
            data-md-fs="xs"
            data-stack="x"
            data-transform="nowrap"
            onClick={edit.enable}
            type="button"
          >
            {DateFormat.day(language, Temporal.PlainDate.from(props.measurement.measuredOn))}
            <span data-color="neutral-500" data-mr="1-5">
              {`${DateFormat.weekday(language, Temporal.PlainDate.from(props.measurement.measuredOn))}`}
            </span>
          </button>
        </td>
      )}

      {!open && (
        <td data-md-px="1" data-px="1-5" data-py="1-5">
          <div data-main="end" data-stack="x">
            <button
              data-color="neutral-0"
              data-cursor="pointer"
              data-fs="sm"
              data-fw="semibold"
              data-md-fs="xs"
              data-transform="nowrap"
              onClick={edit.enable}
              type="button"
            >
              {t("measurements.body_weight.value", {
                weight: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
              })}
            </button>
          </div>
        </td>
      )}

      {!open && (
        <td
          data-fs="xs"
          data-md-px="1"
          data-px="1-5"
          data-py="1-5"
          {...bg.Rhythm(56).times(1).style.minWidth}
        >
          <BodyWeightDelta
            current={props.measurement.weight}
            goal={props.goal}
            previous={props.previous?.weight}
          />
        </td>
      )}

      {!open && (
        <td data-md-pl="1" data-pl="1-5" data-pr="0" data-py="1-5">
          <div data-stack="x" data-wrap="nowrap">
            <button
              className="c-button"
              data-color={props.measurement.reference ? "brand-400" : "neutral-400"}
              data-hover-color="brand-300"
              data-md-px="1"
              data-variant="ghost"
              onClick={reference.enable}
              title={t("measurements.body_weight.reference.title")}
              type="button"
              {...reference.props.controller}
            >
              <Flag data-size="sm" fill={props.measurement.reference ? "currentColor" : "none"} />
            </button>

            <BodyWeightMeasurementRemove measurement={props.measurement} />
          </div>
        </td>
      )}
    </tr>
  );
}
