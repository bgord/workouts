import { GetBodyWeightMeasurementQuery } from "./get-body-weight-measurement.adapter";
import { ListBodyWeightMeasurementsQuery } from "./list-body-weight-measurements.adapter";
import { ListBodyWeightMeasurementsForMonthQuery } from "./list-body-weight-measurements-for-month.adapter";
import { ListBodyWeightMeasurementsForStatsQuery } from "./list-body-weight-measurements-for-stats.adapter";
import { ListBodyWeightMonthsQuery } from "./list-body-weight-months.adapter";

export function createMeasurementsAdapters() {
  return {
    GetBodyWeightMeasurementQuery,
    ListBodyWeightMeasurementsQuery,
    ListBodyWeightMeasurementsForMonthQuery,
    ListBodyWeightMeasurementsForStatsQuery,
    ListBodyWeightMonthsQuery,
  };
}
