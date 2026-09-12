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
  index: number;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const edit = bg.useToggle({ name: `correct-${props.measurement.id}` });

  return (
    <li
      data-bct={props.index > 0 ? "alpha-subtle" : undefined}
      data-bst={props.index > 0 ? "solid" : undefined}
      data-bwt={props.index > 0 ? "hairline" : undefined}
      data-cross="center"
      data-gap="3"
      data-py="1-5"
      data-stack="x"
      data-wrap="nowrap"
    >
      {edit.off && (
        <div data-color="neutral-300" data-fs="sm" data-fw="medium" data-grow="1">
          {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.measurement.measuredOn))}
        </div>
      )}

      {edit.off && (
        <div data-color="neutral-100" data-fs="sm" data-fw="medium">
          {t("measurements.body_weight.value", {
            weight: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
          })}
        </div>
      )}

      {edit.off && (
        <div data-fs="xs" {...bg.Rhythm(56).times(1).style.minWidth}>
          <DeltaKg
            current={props.measurement.weight}
            decimals={BodyWeightDecimals}
            previous={props.previous?.weight}
          />
        </div>
      )}

      <div data-grow={edit.on ? "1" : undefined} data-stack="x">
        {edit.off && <BodyWeightReferenceSet measurement={props.measurement} />}

        <BodyWeightMeasurementCorrect measurement={props.measurement} toggle={edit} />

        {edit.off && <BodyWeightMeasurementRemove measurement={props.measurement} />}
      </div>
    </li>
  );
}
