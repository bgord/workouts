import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CsvParser: bg.CsvParserPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.DailyStepsImportCommandType>;
};

export const DailyStepsImport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const form = await context.request.form();

    const userId = context.identity.authenticatedUserId();
    const file = v.parse(v.instance(File), form.get("file"));

    const rows = await new Measurements.Services.DailyStepsImportFileCsv(await file.text(), deps).rows();

    const entries = await Promise.all(
      rows.map(async (row) => {
        const provider = new Measurements.Services.StepsProviderManualStrategy({ count: row.count });

        return { day: row.day, count: await provider.provide(), source: provider.source };
      }),
    );

    const command = bg.command(
      Measurements.Commands.DailyStepsImportCommand,
      { payload: { entries, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
