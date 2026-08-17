import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionAddCommandType>;
};

export const PlanSectionExerciseInstructionAdd =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const exerciseInstruction = {
      id: v.parse(Plans.VO.ExerciseInstructionId, deps.IdProvider.generate()),
      exerciseId: v.parse(Exercises.VO.ExerciseId, body["exerciseId"]),
      sets: v.parse(Plans.VO.Sets, body["sets"]),
      reps: v.parse(Plans.VO.Reps, body["reps"]),
    };

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionAddCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { planId, planSectionId, exerciseInstruction, userId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
