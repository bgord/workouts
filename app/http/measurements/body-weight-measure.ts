import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyWeightMeasureCommandType>;
};

export const BodyWeightMeasure =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyWeightMeasurementId, deps.IdProvider.generate());
    const weight = v.parse(Measurements.VO.BodyWeight, body["weight"]);
    const measuredOn = v.parse(Measurements.VO.BodyWeightMeasuredOn, body["measuredOn"]);

    const command = bg.command(
      Measurements.Commands.BodyWeightMeasureCommand,
      { payload: { id, weight, measuredOn, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return Response.json({ id });
  };
