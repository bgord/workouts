import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionUpdateCommandType>;
};

export const PlanSectionExerciseInstructionUpdate =
  (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
    const context = new bg.RequestContextHonoAdapter(c);
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.userId() as string;
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const exerciseInstructionId = v.parse(Plans.VO.ExerciseInstructionId, params["exerciseInstructionId"]);
    const exerciseInstruction = {
      id: exerciseInstructionId,
      sets: v.parse(Plans.VO.Sets, body["sets"]),
      reps: v.parse(Plans.VO.Reps, body["reps"]),
    };

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionUpdateCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { planId, planSectionId, exerciseInstruction, userId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
