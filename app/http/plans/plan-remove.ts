import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanRemoveCommandType>;
};

export const PlanRemove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const requesterId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);

    const command = bg.command(
      Plans.Commands.PlanRemoveCommand,
      { revision: context.middleware.revision.fromWeakETag(), payload: { planId, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
