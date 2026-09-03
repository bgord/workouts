import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutAbandonCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutAbandonCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.abandon(command.payload.requesterId);
    await deps.repo.save(workout);
  };
