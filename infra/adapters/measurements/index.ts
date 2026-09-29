import { GetBodyPartQuery } from "./get-body-part.adapter";
import { GetBodyPartByNameQuery } from "./get-body-part-by-name.adapter";
import { GetBodyPartMeasurementQuery } from "./get-body-part-measurement.adapter";
import { GetBodyPartNameCountQuery } from "./get-body-part-name-count.adapter";
import { GetBodyWeightMeasurementQuery } from "./get-body-weight-measurement.adapter";
import { ListBodyPartMeasurementExportRowsQuery } from "./list-body-part-measurement-export-rows.adapter";
import { ListBodyPartNamesQuery } from "./list-body-part-names.adapter";
import { ListBodyPartsQuery } from "./list-body-parts.adapter";
import { ListBodyWeightMeasurementsQuery } from "./list-body-weight-measurements.adapter";
import { ListBodyWeightMeasurementsForMonthQuery } from "./list-body-weight-measurements-for-month.adapter";
import { ListBodyWeightMeasurementsForStatsQuery } from "./list-body-weight-measurements-for-stats.adapter";
import { ListBodyWeightMonthsQuery } from "./list-body-weight-months.adapter";

export function createMeasurementsAdapters() {
  return {
    GetBodyPartQuery,
    GetBodyPartByNameQuery,
    GetBodyPartMeasurementQuery,
    GetBodyPartNameCountQuery,
    GetBodyWeightMeasurementQuery,
    ListBodyPartMeasurementExportRowsQuery,
    ListBodyPartNamesQuery,
    ListBodyPartsQuery,
    ListBodyWeightMeasurementsQuery,
    ListBodyWeightMeasurementsForMonthQuery,
    ListBodyWeightMeasurementsForStatsQuery,
    ListBodyWeightMonthsQuery,
  };
}
