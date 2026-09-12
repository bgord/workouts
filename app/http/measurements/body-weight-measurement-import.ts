import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CsvParser: Measurements.Ports.CsvParserPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyWeightMeasurementsImportCommandType>;
};

export const BodyWeightMeasurementImport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const form = await context.request.form();

    const userId = context.identity.authenticatedUserId();
    const file = v.parse(v.instance(File), form.get("file"));

    const rows = await new Measurements.Services.BodyWeightMeasurementImportFileCsv(
      await file.text(),
      deps,
    ).rows();

    const measurements = rows.map((row) => ({
      ...row,
      id: v.parse(Measurements.VO.BodyWeightMeasurementId, deps.IdProvider.generate()),
    }));

    const command = bg.command(
      Measurements.Commands.BodyWeightMeasurementsImportCommand,
      { payload: { measurements, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
