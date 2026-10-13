// cspell:ignore Stringifier
import type * as bg from "@bgord/bun";
import * as Measurements from "+measurements";

type Dependencies = {
  Clock: bg.ClockPort;
  CsvStringifier: bg.CsvStringifierPort;
  ListDailyStepsQuery: Measurements.Queries.ListDailySteps;
};

export const DailyStepsExport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const entries = await deps.ListDailyStepsQuery.execute(userId);

    return new Measurements.Services.DailyStepsExportFileCsv(entries, deps).toResponse();
  };
