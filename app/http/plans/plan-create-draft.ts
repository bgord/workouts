import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanDraftCreateCommandType>;
};

export const PlanCreateDraft = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.json();
  const ownerId = c.get("user").id;

  const id = v.parse(Plans.VO.PlanId, deps.IdProvider.generate());
  const name = v.parse(Plans.VO.PlanName, body.name);

  const command = bg.command(Plans.Commands.PlanDraftCreateCommand, { payload: { id, name, ownerId } }, deps);

  await deps.CommandBus.emit(command);

  return new Response();
};
