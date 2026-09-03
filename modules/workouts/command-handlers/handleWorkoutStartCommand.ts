import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";
import { WorkoutInProgressLimitForOwner } from "../invariants/workout-in-progress-limit-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetWorkoutInProgressForOwnerCountQuery: Workouts.Queries.GetWorkoutInProgressForOwnerCount;
};

export const handleWorkoutStartCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutStartCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);

    const count = await deps.GetWorkoutInProgressForOwnerCountQuery.execute(command.payload.requesterId);

    WorkoutInProgressLimitForOwner.enforce({ count });

    workout.start(command.payload.requesterId);
    await deps.repo.save(workout);
  };
