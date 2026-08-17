import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanEditingEnableCommandType>;
};

export const PlanEditingEnable =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);

    const command = bg.command(
      Plans.Commands.PlanEditingEnableCommand,
      { revision: context.middleware.revision.fromWeakETag(), payload: { planId, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
