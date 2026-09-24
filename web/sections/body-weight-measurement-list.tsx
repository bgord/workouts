import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightMeasurementFilters } from "./body-weight-measurement-filters";
import { BodyWeightMeasurementRow } from "./body-weight-measurement-row";

export function BodyWeightMeasurementList() {
  const { measurements, previous, bodyWeightStats } = measurementsRoute.useLoaderData();

  return (
    <div data-stack="y" {...ui.Gap.block}>
      <BodyWeightMeasurementFilters />

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
    </div>
  );
}
