import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseCategoryRenameCommandType>;
};

export const ExerciseCategoryRename =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Exercises.VO.ExerciseCategoryId, params["exerciseCategoryId"]);
    const name = v.parse(Exercises.VO.ExerciseCategoryName, body["name"]);

    const command = bg.command(
      Exercises.Commands.ExerciseCategoryRenameCommand,
      { payload: { id, name, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
