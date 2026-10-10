import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartDescriptionSetCommandType>;
};

export const BodyPartDescriptionSet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartId, params["bodyPartId"]);
    const description = v.parse(
      v.optional(Measurements.VO.BodyPartDescription),
      body["description"] ?? undefined,
    );

    const command = bg.command(
      Measurements.Commands.BodyPartDescriptionSetCommand,
      { payload: { id, description, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
