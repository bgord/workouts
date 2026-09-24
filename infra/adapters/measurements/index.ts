import { GetBodyWeightMeasurementQuery } from "./get-body-weight-measurement.adapter";
import { ListBodyWeightMeasurementsQuery } from "./list-body-weight-measurements.adapter";
import { ListBodyWeightMeasurementsForStatsQuery } from "./list-body-weight-measurements-for-stats.adapter";

export function createMeasurementsAdapters() {
  return {
    GetBodyWeightMeasurementQuery,
    ListBodyWeightMeasurementsQuery,
    ListBodyWeightMeasurementsForStatsQuery,
  };
}
