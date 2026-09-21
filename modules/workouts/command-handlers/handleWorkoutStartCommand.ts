import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";
import { WorkoutInProgressLimitForOwner } from "../invariants/workout-in-progress-limit-for-owner";
import { WorkoutStatusEnum } from "../value-objects/workout-status";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetWorkoutStatusForOwnerCountQuery: Workouts.Queries.GetWorkoutStatusForOwnerCount;
};

export const handleWorkoutStartCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutStartCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);

    const count = await deps.GetWorkoutStatusForOwnerCountQuery.execute(
      command.payload.requesterId,
      WorkoutStatusEnum.in_progress,
    );

    WorkoutInProgressLimitForOwner.enforce({ count });

    workout.start(command.payload.requesterId);
    await deps.repo.save(workout);
  };
