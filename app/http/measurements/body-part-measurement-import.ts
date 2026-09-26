import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CsvParser: bg.CsvParserPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartMeasurementsImportCommandType>;
  ListBodyPartsQuery: Measurements.Queries.ListBodyParts;
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

    const bodyParts = await deps.ListBodyPartsQuery.execute(userId);
    const byName = new Map(bodyParts.map((bodyPart) => [bodyPart.name, bodyPart]));

    const measurements = rows.map((row) => {
      const bodyPart = byName.get(row.bodyPartName) ?? null;

      Measurements.Invariants.BodyPartExists.enforce({ bodyPart });

      return {
        id: v.parse(Measurements.VO.BodyPartMeasurementId, deps.IdProvider.generate()),
        bodyPartId: bodyPart!.id,
        value: row.value,
        measuredOn: row.measuredOn,
      };
    });

    const command = bg.command(
      Measurements.Commands.BodyPartMeasurementsImportCommand,
      { payload: { measurements, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
