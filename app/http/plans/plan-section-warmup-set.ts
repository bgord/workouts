import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionWarmupSetCommandType>;
};

export const PlanSectionWarmupSet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const warmup = v.parse(v.optional(Plans.VO.PlanSectionWarmup), body["warmup"] ?? undefined);

    const command = bg.command(
      Plans.Commands.PlanSectionWarmupSetCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { planId, planSectionId, warmup, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
