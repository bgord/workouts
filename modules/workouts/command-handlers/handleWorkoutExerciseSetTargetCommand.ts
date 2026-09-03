import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutExerciseSetTargetCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutExerciseSetTargetCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.setExerciseTarget(
      command.payload.workoutExerciseId,
      command.payload.target,
      command.payload.requesterId,
    );
    await deps.repo.save(workout);
  };
