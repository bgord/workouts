import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyWeightMeasurementCorrectCommandType>;
};

export const BodyWeightMeasurementCorrect =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyWeightMeasurementId, params["bodyWeightMeasurementId"]);
    const weight = v.parse(Measurements.VO.BodyWeight, body["weight"]);
    const measuredOn = v.parse(Measurements.VO.BodyWeightMeasuredOn, body["measuredOn"]);

    const command = bg.command(
      Measurements.Commands.BodyWeightMeasurementCorrectCommand,
      { payload: { id, weight, measuredOn, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
