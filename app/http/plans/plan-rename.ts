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
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();
  const body = await context.request.json();

  const ownerId = context.identity.userId() as string;
  const planId = v.parse(Plans.VO.PlanId, params["planId"]);
  const planName = v.parse(Plans.VO.PlanName, body["planName"]);
  const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

  const command = bg.command(
    Plans.Commands.PlanRenameCommand,
    { revision, payload: { planId, planName, ownerId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
