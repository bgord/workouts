import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutSetLogCommandType>;
};

export const WorkoutSetLog =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const workoutExerciseId = v.parse(Workouts.VO.WorkoutExerciseId, params["workoutExerciseId"]);
    const loggedSetId = v.parse(Workouts.VO.LoggedSetId, deps.IdProvider.generate());
    const reps = v.parse(Workouts.VO.Reps, body["reps"]);
    const load = v.parse(Workouts.VO.Load, body["load"]);

    const command = bg.command(
      Workouts.Commands.WorkoutSetLogCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, workoutExerciseId, loggedSetId, reps, load, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
