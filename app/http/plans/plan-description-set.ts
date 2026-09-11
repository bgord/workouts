import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanDescriptionSetCommandType>;
};

export const PlanDescriptionSet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const description = v.parse(v.optional(Plans.VO.PlanDescription), body["description"] ?? undefined);

    const command = bg.command(
      Plans.Commands.PlanDescriptionSetCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { planId, description, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
