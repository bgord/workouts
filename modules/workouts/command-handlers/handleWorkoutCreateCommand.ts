import type * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Plans from "+plans";
import type * as Workouts from "+workouts";
import { Workout } from "../aggregates/workout";
import { WorkoutDraftLimitForOwner } from "../invariants/workout-draft-limit-for-owner";
import { WorkoutPlanReady } from "../invariants/workout-plan-ready";
import { WorkoutPlanSectionReady } from "../invariants/workout-plan-section-ready";
import { WorkoutScheduledForIsWithinHorizon } from "../invariants/workout-scheduled-for-is-within-horizon";
import { WorkoutExerciseDescription } from "../value-objects/workout-exercise-description";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutExerciseName } from "../value-objects/workout-exercise-name";
import { WorkoutPlanName } from "../value-objects/workout-plan-name";
import { WorkoutPlanSectionCooldown } from "../value-objects/workout-plan-section-cooldown";
import { WorkoutPlanSectionName } from "../value-objects/workout-plan-section-name";
import { WorkoutPlanSectionWarmup } from "../value-objects/workout-plan-section-warmup";
import { WorkoutStatusEnum } from "../value-objects/workout-status";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetFinalizedPlanOHQ: Plans.OHQ.GetFinalizedPlanOHQ;
  GetWorkoutStatusForOwnerCountQuery: Workouts.Queries.GetWorkoutStatusForOwnerCount;
};

export const handleWorkoutCreateCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutCreateCommandType) => {
    WorkoutScheduledForIsWithinHorizon.enforce({
      scheduledFor: command.payload.scheduledFor,
      now: deps.Clock.now(),
    });

    const plan = await deps.GetFinalizedPlanOHQ.execute(command.payload.planId, command.payload.userId);

    WorkoutPlanReady.enforce({ plan });

    const section = plan!.sections.find((section) => section.id === command.payload.planSectionId);

    WorkoutPlanSectionReady.enforce({ section });

    const count = await deps.GetWorkoutStatusForOwnerCountQuery.execute(
      command.payload.userId,
      WorkoutStatusEnum.draft,
    );

    WorkoutDraftLimitForOwner.enforce({ count });

    const workout = Workout.create(
      command.payload.workoutId,
      command.payload.planId,
      v.parse(WorkoutPlanName, plan!.name),
      section!.id,
      v.parse(WorkoutPlanSectionName, section!.name),
      v.parse(v.optional(WorkoutPlanSectionWarmup), section!.warmup ?? undefined),
      v.parse(v.optional(WorkoutPlanSectionCooldown), section!.cooldown ?? undefined),
      command.payload.scheduledFor,
      command.payload.userId,
      deps,
    );

    for (const instruction of section!.exerciseInstructions) {
      workout.addExercise(
        v.parse(WorkoutExerciseId, deps.IdProvider.generate()),
        instruction.exercise.id,
        v.parse(WorkoutExerciseName, instruction.exercise.name),
        v.parse(WorkoutExerciseDescription, instruction.exercise.description),
        { sets: instruction.sets, reps: instruction.reps, progression: instruction.progression },
        command.payload.userId,
      );
    }

    await deps.repo.save(workout);
  };
