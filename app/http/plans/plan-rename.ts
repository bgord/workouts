import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanRenameCommandType>;
};

export const PlanRename =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planName = v.parse(Plans.VO.PlanName, body["planName"]);

    const command = bg.command(
      Plans.Commands.PlanRenameCommand,
      { revision: context.middleware.revision.fromWeakETag(), payload: { planId, planName, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
