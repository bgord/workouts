import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseCategoryDeleteCommandType>;
};

export const ExerciseCategoryDelete =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Exercises.VO.ExerciseCategoryId, params["exerciseCategoryId"]);

    const command = bg.command(
      Exercises.Commands.ExerciseCategoryDeleteCommand,
      { payload: { id, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
