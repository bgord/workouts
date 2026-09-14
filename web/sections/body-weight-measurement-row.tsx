import * as bg from "@bgord/ui";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { DeltaKg } from "../components/delta-kg";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";
import { BodyWeightMeasurementCorrect } from "./body-weight-measurement-correct";
import { BodyWeightMeasurementRemove } from "./body-weight-measurement-remove";
import { BodyWeightReferenceSet } from "./body-weight-reference-set";

export function BodyWeightMeasurementRow(props: {
  measurement: BodyWeightMeasurement;
  previous: BodyWeightMeasurement | undefined;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const edit = bg.useToggle({ name: `correct-${props.measurement.id}` });

  return (
    <tr>
      {edit.on && (
        <td colSpan={4} data-px="0" data-py="1-5">
          <BodyWeightMeasurementCorrect measurement={props.measurement} toggle={edit} />
        </td>
      )}

      {edit.off && (
        <td data-md-pr="1" data-pl="0" data-pr="1-5" data-py="1-5" data-width="100%">
          <button
            data-color="neutral-300"
            data-cursor="pointer"
            data-fs="sm"
            data-fw="medium"
            data-md-fs="xs"
            data-transform="nowrap"
            onClick={edit.enable}
            type="button"
          >
            {DateFormat.dayWithWeekday(language, new Date(props.measurement.measuredOn))}
          </button>
        </td>
      )}

      {edit.off && (
        <td data-md-px="1" data-px="1-5" data-py="1-5">
          <button
            data-color="neutral-100"
            data-cursor="pointer"
            data-fs="sm"
            data-fw="medium"
            data-md-fs="xs"
            data-transform="nowrap"
            onClick={edit.enable}
            type="button"
          >
            {t("measurements.body_weight.value", {
              weight: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
            })}
          </button>
        </td>
      )}

      {edit.off && (
        <td
          data-fs="xs"
          data-md-px="1"
          data-px="1-5"
          data-py="1-5"
          {...bg.Rhythm(56).times(1).style.minWidth}
        >
          <DeltaKg
            current={props.measurement.weight}
            decimals={BodyWeightDecimals}
            previous={props.previous?.weight}
          />
        </td>
      )}

      {edit.off && (
        <td data-md-pl="1" data-pl="1-5" data-pr="0" data-py="1-5">
          <div data-stack="x" data-wrap="nowrap">
            <BodyWeightReferenceSet measurement={props.measurement} />

            <BodyWeightMeasurementRemove measurement={props.measurement} />
          </div>
        </td>
      )}
    </tr>
  );
}
