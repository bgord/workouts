import { measurementsRoute } from "../router";
import { BodyWeightMeasurementRow } from "./body-weight-measurement-row";

export function BodyWeightMeasurementList() {
  const { measurements, previous, bodyWeightStats } = measurementsRoute.useLoaderData();

  return (
    <ul data-stack="y">
      {measurements.map((measurement, index) => (
        <BodyWeightMeasurementRow
          first={index === 0}
          goal={bodyWeightStats?.reference?.goal}
          key={measurement.id}
          measurement={measurement}
          previous={measurements[index + 1] ?? previous ?? undefined}
        />
      ))}
    </ul>
  );
}
