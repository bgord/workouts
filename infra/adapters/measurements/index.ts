import { GetBodyWeightMeasurementQuery } from "./get-body-weight-measurement.adapter";
import { ListBodyWeightMeasurementsQuery } from "./list-body-weight-measurements.adapter";

export function createMeasurementsAdapters() {
  return { GetBodyWeightMeasurementQuery, ListBodyWeightMeasurementsQuery };
}
