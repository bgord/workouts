import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutSetCorrectCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutSetCorrectCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.correctSet(
      command.payload.workoutExerciseId,
      command.payload.setNumber,
      command.payload.reps,
      command.payload.load,
      command.payload.requesterId,
    );
    await deps.repo.save(workout);
  };
