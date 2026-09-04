import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutExerciseRemoveCommandType>;
};

export const WorkoutExerciseRemove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const workoutExerciseId = v.parse(Workouts.VO.WorkoutExerciseId, params["workoutExerciseId"]);

    const command = bg.command(
      Workouts.Commands.WorkoutExerciseRemoveCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, workoutExerciseId, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
