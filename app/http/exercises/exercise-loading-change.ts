import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseLoadingChangeCommandType>;
};

export const ExerciseLoadingChange =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);
    const loading = v.parse(Exercises.VO.ExerciseLoading, body["loading"]);

    const command = bg.command(
      Exercises.Commands.ExerciseLoadingChangeCommand,
      { payload: { id, loading, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
