import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartDefineCommandType>;
};

export const BodyPartDefine =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartId, deps.IdProvider.generate());
    const name = v.parse(Measurements.VO.BodyPartName, body["name"]);

    const command = bg.command(
      Measurements.Commands.BodyPartDefineCommand,
      { payload: { id, name, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
