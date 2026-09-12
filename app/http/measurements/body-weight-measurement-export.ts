// cspell:ignore Stringifier
import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";

type Dependencies = {
  Clock: bg.ClockPort;
  CsvStringifier: bg.CsvStringifierPort;
  ListBodyWeightMeasurementsQuery: Measurements.Queries.ListBodyWeightMeasurements;
};

export const BodyWeightMeasurementExport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const measurements = await deps.ListBodyWeightMeasurementsQuery.execute(userId);

    return new Measurements.Services.BodyWeightMeasurementExportFileCsv(measurements, deps).toResponse();
  };
