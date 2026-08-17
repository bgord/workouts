import * as bg from "@bgord/bun";
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
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();
  const body = await context.request.json();

  const userId = context.identity.authenticatedUserId();
  const planId = v.parse(Plans.VO.PlanId, params["planId"]);
  const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
  const planSectionName = v.parse(Plans.VO.PlanSectionName, body["planSectionName"]);

  const command = bg.command(
    Plans.Commands.PlanSectionRenameCommand,
    {
      revision: context.middleware.revision.fromWeakETag(),
      payload: { planId, planSectionId, planSectionName, userId },
    },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
