// biome-ignore-all lint: lint/style/noNonNullAssertion
import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import { WorkoutCatalogExerciseExists } from "../invariants/workout-catalog-exercise-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetExerciseOHQ: Exercises.OHQ.GetExerciseOHQ;
};

export const handleWorkoutExerciseAddCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutExerciseAddCommandType) => {
    const exercise = await deps.GetExerciseOHQ.execute(command.payload.exerciseId);

    WorkoutCatalogExerciseExists.enforce({ exercise });

    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.addExercise(
      command.payload.workoutExerciseId,
      exercise!.id,
      exercise!.name,
      exercise!.imageEtag,
      exercise!.description,
      command.payload.prescription,
      command.payload.requesterId,
    );
    await deps.repo.save(workout);
  };
