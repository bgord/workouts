import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartMeasureCommandType>;
};

export const BodyPartMeasure =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const measuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, body["measuredOn"]);
    const entries = v.parse(Measurements.VO.BodyPartMeasurementEntries, body["measurements"]);

    const measurements = entries.map((entry) => ({
      ...entry,
      id: v.parse(Measurements.VO.BodyPartMeasurementId, deps.IdProvider.generate()),
    }));

    const command = bg.command(
      Measurements.Commands.BodyPartMeasureCommand,
      { payload: { measuredOn, measurements, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
