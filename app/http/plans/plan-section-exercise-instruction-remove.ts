import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionRemoveCommandType>;
};

export const PlanSectionExerciseInstructionRemove =
  (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
    const context = new bg.RequestContextHonoAdapter(c);
    const params = context.request.params();

    const ownerId = context.identity.userId() as string;
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const exerciseInstructionId = v.parse(Plans.VO.ExerciseInstructionId, params["exerciseInstructionId"]);
    const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionRemoveCommand,
      { revision, payload: { planId, planSectionId, exerciseInstructionId, ownerId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
