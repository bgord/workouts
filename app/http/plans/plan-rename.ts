import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanRenameCommandType>;
};

export const PlanRename = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.json();
  const ownerId = c.get("user").id;

  const planId = v.parse(Plans.VO.PlanId, c.req.param("planId"));
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));
  const planName = v.parse(Plans.VO.PlanName, body.planName);

  const command = bg.command(
    Plans.Commands.PlanRenameCommand,
    { revision, payload: { planId, planName, ownerId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
