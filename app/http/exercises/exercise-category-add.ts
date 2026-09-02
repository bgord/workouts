import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseCategoryAddCommandType>;
};

export const ExerciseCategoryAdd =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Exercises.VO.ExerciseCategoryId, deps.IdProvider.generate());
    const name = v.parse(Exercises.VO.ExerciseCategoryName, body["name"]);

    const command = bg.command(
      Exercises.Commands.ExerciseCategoryAddCommand,
      { payload: { id, name, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
