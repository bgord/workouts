import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import type * as Workouts from "+workouts";
import { Workout } from "../aggregates/workout";
import { WorkoutPlanReady } from "../invariants/workout-plan-ready";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetFinalizedPlanOHQ: Plans.OHQ.GetFinalizedPlanOHQ;
};

export const handleWorkoutCreateCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutCreateCommandType) => {
    const plan = await deps.GetFinalizedPlanOHQ.execute(command.payload.planId, command.payload.userId);

    WorkoutPlanReady.enforce({ plan });

    const workout = Workout.create(
      command.payload.workoutId,
      command.payload.planId,
      command.payload.scheduledFor,
      command.payload.userId,
      deps,
    );

    await deps.repo.save(workout);
  };
