// cspell:ignore Stringifier
import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";

type Dependencies = {
  Clock: bg.ClockPort;
  CsvStringifier: bg.CsvStringifierPort;
  ListBodyPartMeasurementExportRowsQuery: Measurements.Queries.ListBodyPartMeasurementExportRows;
};

export const BodyPartMeasurementExport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const rows = await deps.ListBodyPartMeasurementExportRowsQuery.execute(userId);

    return new Measurements.Services.BodyPartMeasurementExportFileCsv(rows, deps).toResponse();
  };
