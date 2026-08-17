import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanFinalizeCommandType>;
};

export const PlanFinalize = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();

  const userId = context.identity.authenticatedUserId();
  const planId = v.parse(Plans.VO.PlanId, params["planId"]);

  const command = bg.command(
    Plans.Commands.PlanFinalizeCommand,
    { revision: context.middleware.revision.fromWeakETag(), payload: { planId, userId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
