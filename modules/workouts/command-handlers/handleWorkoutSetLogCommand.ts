import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutSetLogCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutSetLogCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.logSet(
      command.payload.workoutExerciseId,
      command.payload.loggedSetId,
      command.payload.reps,
      command.payload.load,
      command.payload.rir,
      command.payload.requesterId,
    );
    await deps.repo.save(workout);
  };
