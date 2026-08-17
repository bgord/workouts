import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionExerciseChangeCommandType>;
};

export const PlanSectionExerciseInstructionExerciseChange =
  (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
    const context = new bg.RequestContextHonoAdapter(c);
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.userId() as bg.UUIDType;
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const exerciseInstructionId = v.parse(Plans.VO.ExerciseInstructionId, params["exerciseInstructionId"]);
    const exerciseInstruction = {
      id: exerciseInstructionId,
      exerciseId: v.parse(Exercises.VO.ExerciseId, body["exerciseId"]),
    };

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionExerciseChangeCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { planId, planSectionId, exerciseInstruction, userId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
