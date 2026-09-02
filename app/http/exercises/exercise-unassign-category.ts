import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseUnassignCategoryCommandType>;
};

export const ExerciseUnassignCategory =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const exerciseId = v.parse(Exercises.VO.ExerciseId, body["exerciseId"]);
    const exerciseCategoryId = v.parse(Exercises.VO.ExerciseCategoryId, body["exerciseCategoryId"]);

    const command = bg.command(
      Exercises.Commands.ExerciseUnassignCategoryCommand,
      { payload: { exerciseId, exerciseCategoryId, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
