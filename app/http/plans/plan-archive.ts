import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanArchiveCommandType>;
};

export const PlanArchive =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);

    const command = bg.command(
      Plans.Commands.PlanArchiveCommand,
      { revision: context.middleware.revision.fromWeakETag(), payload: { planId, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
