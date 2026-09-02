import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseUpdateCommandType>;
};

export const ExerciseUpdate =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);
    const name = v.parse(Exercises.VO.ExerciseName, body["name"]);
    const description = v.parse(Exercises.VO.ExerciseDescription, body["description"]);

    const command = bg.command(
      Exercises.Commands.ExerciseUpdateCommand,
      { payload: { id, name, description, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
