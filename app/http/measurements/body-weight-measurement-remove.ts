import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyWeightMeasurementRemoveCommandType>;
};

export const BodyWeightMeasurementRemove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyWeightMeasurementId, params["bodyWeightMeasurementId"]);

    const command = bg.command(
      Measurements.Commands.BodyWeightMeasurementRemoveCommand,
      { payload: { id, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
