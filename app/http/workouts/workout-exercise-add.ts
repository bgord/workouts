import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutExerciseAddCommandType>;
};

export const WorkoutExerciseAdd =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const workoutExerciseId = v.parse(Workouts.VO.WorkoutExerciseId, deps.IdProvider.generate());
    const exerciseId = v.parse(Exercises.VO.ExerciseId, body["exerciseId"]);
    const prescription = v.parse(Workouts.VO.ExercisePrescription, {
      sets: body["sets"],
      reps: body["reps"],
    });

    const command = bg.command(
      Workouts.Commands.WorkoutExerciseAddCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, workoutExerciseId, exerciseId, prescription, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
