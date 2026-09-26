import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartRemoveCommandType>;
};

export const BodyPartRemove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartId, params["bodyPartId"]);

    const command = bg.command(
      Measurements.Commands.BodyPartRemoveCommand,
      { payload: { id, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
