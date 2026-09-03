import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";
import { Workout } from "../aggregates/workout";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutCreateCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutCreateCommandType) => {
    const workout = Workout.create(
      command.payload.workoutId,
      command.payload.planId,
      command.payload.scheduledFor,
      command.payload.userId,
      deps,
    );

    await deps.repo.save(workout);
  };
