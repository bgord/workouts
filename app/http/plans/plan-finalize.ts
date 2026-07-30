import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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

  const ownerId = context.identity.userId() as string;
  const planId = v.parse(Plans.VO.PlanId, params["planId"]);
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = bg.command(
    Plans.Commands.PlanFinalizeCommand,
    { revision, payload: { planId, ownerId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
