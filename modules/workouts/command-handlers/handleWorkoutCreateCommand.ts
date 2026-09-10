import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Plans from "+plans";
import type * as Workouts from "+workouts";
import { Workout } from "../aggregates/workout";
import { WorkoutDraftLimitForOwner } from "../invariants/workout-draft-limit-for-owner";
import { WorkoutPlanReady } from "../invariants/workout-plan-ready";
import { WorkoutPlanSectionReady } from "../invariants/workout-plan-section-ready";
import { WorkoutScheduledForIsWithinHorizon } from "../invariants/workout-scheduled-for-is-within-horizon";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutScheduledForHorizonDaysMax } from "../value-objects/workout-scheduled-for-horizon";

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
    const today = tools.Day.fromTimestamp(deps.Clock.now());

    const earliest = today.shift(v.parse(tools.Integer, -WorkoutScheduledForHorizonDaysMax)).toIsoId();
    const latest = today.shift(v.parse(tools.Integer, WorkoutScheduledForHorizonDaysMax)).toIsoId();

    WorkoutScheduledForIsWithinHorizon.enforce({
      scheduledFor: command.payload.scheduledFor,
      earliest,
      latest,
    });

    const plan = await deps.GetFinalizedPlanOHQ.execute(command.payload.planId, command.payload.userId);

    WorkoutPlanReady.enforce({ plan });

    const section = plan!.sections.find((section) => section.id === command.payload.planSectionId);

    WorkoutPlanSectionReady.enforce({ section });

    const count = await deps.GetWorkoutDraftForOwnerCountQuery.execute(command.payload.userId);

    WorkoutDraftLimitForOwner.enforce({ count });

    const workout = Workout.create(
      command.payload.workoutId,
      command.payload.planId,
      plan!.name,
      section!.id,
      section!.name,
      command.payload.scheduledFor,
      command.payload.userId,
      deps,
    );

    for (const instruction of section!.exerciseInstructions) {
      workout.addExercise(
        v.parse(WorkoutExerciseId, deps.IdProvider.generate()),
        instruction.exercise.id,
        instruction.exercise.name,
        instruction.exercise.imageEtag,
        { sets: instruction.sets, reps: instruction.reps },
        command.payload.userId,
      );
    }

    await deps.repo.save(workout);
  };
