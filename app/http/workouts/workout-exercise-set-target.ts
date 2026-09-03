import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutExerciseSetTargetCommandType>;
};

export const WorkoutExerciseSetTarget =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const workoutExerciseId = v.parse(Workouts.VO.WorkoutExerciseId, params["workoutExerciseId"]);
    const target = {
      sets: v.parse(Workouts.VO.Sets, body["sets"]),
      reps: v.parse(Workouts.VO.Reps, body["reps"]),
      load: v.parse(Workouts.VO.Load, body["load"]),
    };

    const command = bg.command(
      Workouts.Commands.WorkoutExerciseSetTargetCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, workoutExerciseId, target, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
