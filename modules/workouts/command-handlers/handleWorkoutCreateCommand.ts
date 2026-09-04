import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Plans from "+plans";
import type * as Workouts from "+workouts";
import { Workout } from "../aggregates/workout";
import { WorkoutDraftLimitForOwner } from "../invariants/workout-draft-limit-for-owner";
import { WorkoutPlanReady } from "../invariants/workout-plan-ready";
import { WorkoutScheduledForIsNotPast } from "../invariants/workout-scheduled-for-is-not-past";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetFinalizedPlanOHQ: Plans.OHQ.GetFinalizedPlanOHQ;
  GetWorkoutDraftForOwnerCountQuery: Workouts.Queries.GetWorkoutDraftForOwnerCount;
};

export const handleWorkoutCreateCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutCreateCommandType) => {
    const today = tools.Day.fromTimestamp(deps.Clock.now()).toIsoId();

    WorkoutScheduledForIsNotPast.enforce({ scheduledFor: command.payload.scheduledFor, today });

    const plan = await deps.GetFinalizedPlanOHQ.execute(command.payload.planId, command.payload.userId);

    WorkoutPlanReady.enforce({ plan });

    const count = await deps.GetWorkoutDraftForOwnerCountQuery.execute(command.payload.userId);

    WorkoutDraftLimitForOwner.enforce({ count });

    const workout = Workout.create(
      command.payload.workoutId,
      command.payload.planId,
      plan!.name,
      command.payload.scheduledFor,
      command.payload.userId,
      deps,
    );

    for (const section of plan!.sections) {
      for (const instruction of section.exerciseInstructions) {
        workout.addExercise(
          v.parse(WorkoutExerciseId, deps.IdProvider.generate()),
          instruction.exercise.id,
          instruction.exercise.name,
          { sets: instruction.sets, reps: instruction.reps },
          command.payload.userId,
        );
      }
    }

    await deps.repo.save(workout);
  };
