import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutSetRemoveCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutSetRemoveCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.removeSet(
      command.payload.workoutExerciseId,
      command.payload.loggedSetId,
      command.payload.requesterId,
    );
    await deps.repo.save(workout);
  };
