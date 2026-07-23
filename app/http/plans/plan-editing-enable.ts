import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanEditingEnableCommandType>;
};

export const PlanEditingEnable = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const ownerId = c.get("user").id;

  const planId = v.parse(Plans.VO.PlanId, c.req.param("planId"));
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = bg.command(
    Plans.Commands.PlanEditingEnableCommand,
    { revision, payload: { planId, ownerId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
