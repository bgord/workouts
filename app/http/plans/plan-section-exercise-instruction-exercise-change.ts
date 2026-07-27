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
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionExerciseChangeCommandType>;
};

export const PlanSectionExerciseInstructionExerciseChange =
  (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
    const body = await c.req.json();
    const ownerId = c.get("user").id;

    const planId = v.parse(Plans.VO.PlanId, c.req.param("planId"));
    const planSectionId = v.parse(Plans.VO.PlanSectionId, c.req.param("planSectionId"));
    const exerciseInstructionId = v.parse(
      Plans.VO.ExerciseInstructionId,
      c.req.param("exerciseInstructionId"),
    );

    const revision = tools.Revision.fromWeakETag(c.get("WeakETag"));

    const exerciseInstruction = {
      id: exerciseInstructionId,
      exerciseId: v.parse(Exercises.VO.ExerciseId, body.exerciseId),
    };

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionExerciseChangeCommand,
      { revision, payload: { planId, planSectionId, exerciseInstruction, ownerId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
