import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutExerciseMoveCommandType>;
};

export const WorkoutExerciseMove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const workoutExerciseId = v.parse(Workouts.VO.WorkoutExerciseId, params["workoutExerciseId"]);
    const position = v.parse(Workouts.VO.WorkoutExercisePosition, body["position"]);

    const command = bg.command(
      Workouts.Commands.WorkoutExerciseMoveCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, workoutExerciseId, position, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
