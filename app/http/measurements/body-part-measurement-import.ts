import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CsvParser: bg.CsvParserPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartMeasurementsImportCommandType>;
};

export const BodyPartMeasurementImport =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const form = await context.request.form();

    const userId = context.identity.authenticatedUserId();
    const file = v.parse(v.instance(File), form.get("file"));

    const rows = await new Measurements.Services.BodyPartMeasurementImportFileCsv(
      await file.text(),
      deps,
    ).rows();

    const measurements = rows.map((row) => ({
      ...row,
      id: v.parse(Measurements.VO.BodyPartMeasurementId, deps.IdProvider.generate()),
    }));

    const command = bg.command(
      Measurements.Commands.BodyPartMeasurementsImportCommand,
      { payload: { measurements, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
