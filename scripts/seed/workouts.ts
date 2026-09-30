import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import type { BootstrapType } from "+infra/bootstrap";
import { advanceClockBy } from "./clock";
import * as fixtures from "./fixtures";

export type ExerciseHistory = Map<string, Array<Pick<Workouts.Queries.ExercisePerformance, "sets">>>;

export async function createWorkout(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  workout: { id: string; planId: string; planSectionId: string; scheduledFor: tools.DayIsoIdType },
) {
  const deps = { ...di.Adapters.System, ...di.Tools };
  const workoutId = v.parse(Workouts.VO.WorkoutId, workout.id);

  const command = bg.command(
    Workouts.Commands.WorkoutCreateCommand,
    {
      payload: {
        workoutId,
        planId: v.parse(Plans.VO.PlanId, workout.planId),
        planSectionId: v.parse(Plans.VO.PlanSectionId, workout.planSectionId),
        scheduledFor: v.parse(Workouts.VO.WorkoutScheduledFor, workout.scheduledFor),
        userId,
      },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);

  return workoutId;
}

export async function targetWorkout(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  workoutId: Workouts.VO.WorkoutIdType,
  history: ExerciseHistory,
) {
  const deps = { ...di.Adapters.System, ...di.Tools };
  const workout = await di.Adapters.Workouts.WorkoutRepository.load(workoutId);

  for (const exercise of workout.exercises) {
    const previous = history.get(exercise.exerciseId)?.at(-1);

    const target = previous
      ? Workouts.Services.ProgressionMethodStrategyFactory.for(exercise.prescription, previous).calculate()
          .progress
      : undefined;

    const command = bg.command(
      Workouts.Commands.WorkoutExerciseSetTargetCommand,
      {
        revision: (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).revision,
        payload: {
          workoutId,
          workoutExerciseId: exercise.id,
          target: v.parse(
            Workouts.VO.ExerciseTarget,
            target ?? {
              sets: exercise.prescription.sets,
              reps: exercise.prescription.reps.min,
              load: tools.Weight.fromKilograms(fixtures.startingLoads[exercise.exerciseId] ?? 0).get(),
            },
          ),
          requesterId: userId,
        },
      },
      deps,
    );

    await di.Tools.CommandBus.emit(command);
  }
}

export async function startWorkout(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  workoutId: Workouts.VO.WorkoutIdType,
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Workouts.Commands.WorkoutStartCommand,
    {
      revision: (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).revision,
      payload: { workoutId, requesterId: userId },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}

export async function logSets(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  workoutId: Workouts.VO.WorkoutIdType,
  workoutExerciseId: Workouts.VO.WorkoutExerciseIdType,
  sets: ReadonlyArray<{ reps: number; load: number; rir: number }>,
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  for (const set of sets) {
    advanceClockBy(tools.Duration.Minutes(3));

    const command = bg.command(
      Workouts.Commands.WorkoutSetLogCommand,
      {
        revision: (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).revision,
        payload: {
          workoutId,
          workoutExerciseId,
          loggedSetId: v.parse(Workouts.VO.LoggedSetId, deps.IdProvider.generate()),
          reps: v.parse(Workouts.VO.Reps, set.reps),
          load: v.parse(Workouts.VO.Load, set.load),
          rir: v.parse(Workouts.VO.Rir, set.rir),
          requesterId: userId,
        },
      },
      deps,
    );

    await di.Tools.CommandBus.emit(command);
  }
}

export async function completeWorkout(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  workoutId: Workouts.VO.WorkoutIdType,
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Workouts.Commands.WorkoutCompleteCommand,
    {
      revision: (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).revision,
      payload: { workoutId, requesterId: userId },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}
