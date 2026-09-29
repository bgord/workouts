// cspell:ignore Stringifier
import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";

type Dependencies = {
  Clock: bg.ClockPort;
  CsvStringifier: bg.CsvStringifierPort;
  ListBodyPartNamesQuery: Measurements.Queries.ListBodyPartNames;
};

export const BodyPartMeasurementImportTemplate =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const bodyPartNames = await deps.ListBodyPartNamesQuery.execute(userId);

    return new Measurements.Services.BodyPartMeasurementImportTemplateFileCsv(
      bodyPartNames,
      deps,
    ).toResponse();
  };
