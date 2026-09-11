// cspell:ignore Stringifier
import type * as bg from "@bgord/bun";
import * as Workouts from "+workouts";

type Dependencies = {
  Clock: bg.ClockPort;
  CsvStringifier: bg.CsvStringifierPort;
  ListWorkoutExportRowsQuery: Workouts.Queries.ListWorkoutExportRows;
};

export const WorkoutExport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const rows = await deps.ListWorkoutExportRowsQuery.execute(userId);

    return new Workouts.Services.WorkoutExportFileCsv(rows, deps).toResponse();
  };
