import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartRenameCommandType>;
};

export const BodyPartRename =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();
    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartId, params["bodyPartId"]);
    const rawName = v.parse(Measurements.VO.BodyPartName, body["name"]);
    const name = v.parse(Measurements.VO.BodyPartName, Measurements.VO.normalizeBodyPartName(rawName));

    const command = bg.command(
      Measurements.Commands.BodyPartRenameCommand,
      { payload: { id, name, requesterId } },
      deps,
    );
    await deps.CommandBus.emit(command);

    return new Response();
  };
