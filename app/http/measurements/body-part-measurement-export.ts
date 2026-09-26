// cspell:ignore Stringifier
import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";

type Dependencies = {
  Clock: bg.ClockPort;
  CsvStringifier: bg.CsvStringifierPort;
  ListBodyPartMeasurementsQuery: Measurements.Queries.ListBodyPartMeasurements;
  ListBodyPartsQuery: Measurements.Queries.ListBodyParts;
};

export const BodyPartMeasurementExport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const [measurements, bodyParts] = await Promise.all([
      deps.ListBodyPartMeasurementsQuery.execute(userId),
      deps.ListBodyPartsQuery.execute(userId),
    ]);

    return new Measurements.Services.BodyPartMeasurementExportFileCsv(
      measurements,
      bodyParts,
      deps,
    ).toResponse();
  };
