import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanSectionExerciseInstructionRemoveCommandType>;
};

export const PlanSectionExerciseInstructionRemove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const planId = v.parse(Plans.VO.PlanId, params["planId"]);
    const planSectionId = v.parse(Plans.VO.PlanSectionId, params["planSectionId"]);
    const exerciseInstructionId = v.parse(Plans.VO.ExerciseInstructionId, params["exerciseInstructionId"]);

    const command = bg.command(
      Plans.Commands.PlanSectionExerciseInstructionRemoveCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { planId, planSectionId, exerciseInstructionId, userId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
