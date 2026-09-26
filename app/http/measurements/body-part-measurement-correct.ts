import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartMeasurementCorrectCommandType>;
};

export const BodyPartMeasurementCorrect =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartMeasurementId, params["bodyPartMeasurementId"]);
    const value = v.parse(Measurements.VO.BodyPartMeasurementValue, body["value"]);
    const measuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, body["measuredOn"]);

    const command = bg.command(
      Measurements.Commands.BodyPartMeasurementCorrectCommand,
      { payload: { id, value, measuredOn, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
