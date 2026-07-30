import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionAddCommandType>;
};

export const PlanSectionExerciseInstructionAdd =
  (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
    const context = new bg.RequestContextHonoAdapter(c);
    const params = context.request.params();
    const body = await context.request.json();

    const ownerId = context.identity.userId() as string;
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const exerciseInstruction = {
      id: v.parse(Plans.VO.ExerciseInstructionId, deps.IdProvider.generate()),
      exerciseId: v.parse(Exercises.VO.ExerciseId, body["exerciseId"]),
      sets: v.parse(Plans.VO.Sets, body["sets"]),
      reps: v.parse(Plans.VO.Reps, body["reps"]),
    };
    const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionAddCommand,
      { revision, payload: { planId, planSectionId, exerciseInstruction, ownerId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
