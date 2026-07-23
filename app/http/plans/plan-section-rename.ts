import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionRenameCommandType>;
};

export const PlanSectionRename = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.json();
  const ownerId = c.get("user").id;

  const planId = v.parse(Plans.VO.PlanId, c.req.param("planId"));
  const planSectionId = v.parse(Plans.VO.PlanSectionId, c.req.param("planSectionId"));
  const planSectionName = v.parse(Plans.VO.PlanSectionName, body.planSectionName);

  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = bg.command(
    Plans.Commands.PlanSectionRenameCommand,
    { revision, payload: { planId, planSectionId, planSectionName, ownerId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
