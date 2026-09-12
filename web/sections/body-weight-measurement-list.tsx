import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { BodyWeightMeasurementRow } from "./body-weight-measurement-row";

export function BodyWeightMeasurementList(props: { measurements: ReadonlyArray<BodyWeightMeasurement> }) {
  return (
    <ul
      className="c-card"
      data-md-bw="none"
      data-md-p="2-5"
      data-md-px="0"
      data-p="4"
      data-stack="y"
      data-variant="flat"
    >
      {props.measurements.map((measurement, index) => (
        <BodyWeightMeasurementRow
          index={index}
          key={measurement.id}
          measurement={measurement}
          previous={props.measurements[index + 1]}
        />
      ))}
    </ul>
  );
}
