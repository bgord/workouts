import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutSetCorrectCommandType>;
};

export const WorkoutSetCorrect =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const workoutExerciseId = v.parse(Workouts.VO.WorkoutExerciseId, params["workoutExerciseId"]);
    const setNumber = v.parse(Workouts.VO.SetNumber, Number(params["setNumber"]));
    const reps = v.parse(Workouts.VO.Reps, body["reps"]);
    const load = v.parse(Workouts.VO.Load, body["load"]);

    const command = bg.command(
      Workouts.Commands.WorkoutSetCorrectCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, workoutExerciseId, setNumber, reps, load, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
