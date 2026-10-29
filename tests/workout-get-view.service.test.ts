import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutGetView", () => {
  test("happy path", () => {
    const view = new Workouts.Services.WorkoutGetView({
      workout: {
        ...mocks.workoutWithExerciseActions,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: mocks.exerciseTarget,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [{ ...mocks.loggedSet, rir: null }],
            exercise: mocks.exercise,
            previous: mocks.exercisePerformance,
            recent: [mocks.missedExerciseRecentPerformance],
          },
        ],
      },
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(view.calculate()).toEqual({
      data: {
        ...mocks.workoutWithExerciseActions,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: mocks.exerciseTarget,
            exerciseDescription: mocks.workoutExerciseDescription,
            exerciseImageEtag: mocks.exerciseImageEtag,
            loggedSets: [
              {
                ...mocks.loggedSet,
                rir: null,
                rirBelowTarget: false,
                actions: { correct: mocks.actionAvailable, remove: mocks.actionAvailable },
              },
            ],
            previousPerformance: {
              scheduledFor: mocks.exercisePerformance.scheduledFor,
              sets: mocks.exercisePerformance.sets,
              diff: mocks.exerciseTargetDiff,
            },
            recentPerformances: [
              {
                workoutId: mocks.missedExerciseRecentPerformance.workoutId,
                scheduledFor: mocks.missedExerciseRecentPerformance.scheduledFor,
                sets: mocks.missedExerciseRecentPerformance.sets,
                missed: true,
              },
            ],
            targetProgression: {
              last: { ...mocks.exercisePerformanceWeakestSet, sets: mocks.sets },
              regress: v.parse(Workouts.VO.ExerciseTarget, {
                sets: mocks.sets,
                reps: v.parse(Workouts.VO.Reps, 12),
                load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
              }),
              signal: Workouts.VO.ProgressionSignalOptions.sets_below_target,
            },
            actions: {
              targetSet: mocks.actionUnavailable,
              remove: mocks.actionAvailable,
              moveUp: mocks.actionUnavailable,
              moveDown: mocks.actionUnavailable,
              setLog: mocks.actionAvailable,
              catalogView: mocks.actionAvailable,
            },
          },
        ],
      },
      progress: {
        logged: tools.Int.nonNegative(1),
        total: tools.Int.nonNegative(1),
        next: mocks.workoutExerciseId,
      },
      actions: {
        start: mocks.actionUnavailable,
        complete: mocks.actionAvailable,
        copy: mocks.actionUnavailable,
        discard: mocks.actionAvailable,
        exerciseAdd: mocks.actionAvailable,
        noteSet: mocks.actionAvailable,
        reschedule: mocks.actionUnavailable,
        reorder: mocks.actionUnavailable,
      },
    });
  });

  test("happy path - rir below target", () => {
    const view = new Workouts.Services.WorkoutGetView({
      workout: {
        ...mocks.workoutWithExerciseActions,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: mocks.exerciseTarget,
            prescription: mocks.rirExercisePrescription,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [{ ...mocks.loggedSet, rir: v.parse(Workouts.VO.Rir, 1) }],
            exercise: mocks.exercise,
            previous: null,
            recent: [],
          },
        ],
      },
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(view.calculate().data.exercises[0]?.loggedSets[0]?.rirBelowTarget).toEqual(true);
  });

  test("happy path - no previous performance", () => {
    const view = new Workouts.Services.WorkoutGetView({
      workout: {
        ...mocks.workoutWithExerciseActions,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: mocks.exerciseTarget,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [{ ...mocks.loggedSet, rir: null }],
            exercise: mocks.exercise,
            previous: null,
            recent: [],
          },
        ],
      },
      inProgressCount: tools.Int.nonNegative(0),
    });

    const [exercise] = view.calculate().data.exercises;

    expect(exercise?.previousPerformance).toEqual(null);
    expect(exercise?.targetProgression).toEqual(null);
  });

  test("happy path - no target", () => {
    const view = new Workouts.Services.WorkoutGetView({
      workout: {
        ...mocks.workoutWithExerciseActions,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: null,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [{ ...mocks.loggedSet, rir: null }],
            exercise: mocks.exercise,
            previous: mocks.exercisePerformance,
            recent: [],
          },
        ],
      },
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(view.calculate().data.exercises[0]?.previousPerformance?.diff).toEqual(null);
  });

  test("happy path - catalog exercise removed", () => {
    const view = new Workouts.Services.WorkoutGetView({
      workout: {
        ...mocks.workoutWithExerciseActions,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: mocks.exerciseTarget,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [{ ...mocks.loggedSet, rir: null }],
            exercise: null,
            previous: mocks.exercisePerformance,
            recent: [],
          },
        ],
      },
      inProgressCount: tools.Int.nonNegative(0),
    });

    const [exercise] = view.calculate().data.exercises;

    expect(exercise?.exerciseImageEtag).toEqual(null);
    expect(exercise?.targetProgression).toEqual({
      last: { ...mocks.exercisePerformanceWeakestSet, sets: mocks.sets },
      signal: Workouts.VO.ProgressionSignalOptions.sets_below_target,
    });
    expect(exercise?.actions.catalogView).toEqual(mocks.actionUnavailable);
  });

  test("happy path - logged set count across exercises", () => {
    const view = new Workouts.Services.WorkoutGetView({
      workout: {
        ...mocks.workoutWithExerciseActions,
        status: Workouts.VO.WorkoutStatusEnum.completed,
        exercises: [
          {
            ...mocks.workoutExercise,
            target: mocks.exerciseTarget,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [{ ...mocks.loggedSet, rir: null }],
            exercise: mocks.exercise,
            previous: null,
            recent: [],
          },
          {
            ...mocks.workoutExerciseWithoutTargetLogged,
            target: null,
            exerciseDescription: mocks.workoutExerciseDescription,
            loggedSets: [],
            exercise: mocks.exercise,
            previous: null,
            recent: [],
          },
        ],
      },
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(view.calculate().data.exercises[0]?.loggedSets[0]?.actions).toEqual({
      correct: mocks.actionAvailable,
      remove: { available: true, enabled: false, hints: ["workout.retains.logged.sets"] },
    });
  });
});
