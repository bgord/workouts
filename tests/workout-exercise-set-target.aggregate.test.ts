import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.setExerciseTarget", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutIsEditable - completed", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
        mocks.GenericWorkoutCompletedEvent,
      ],
      deps,
    );

    expect(() =>
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutIsEditable.error);
  });

  test("WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.anotherUserId),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("WorkoutExerciseExists", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.setExerciseTarget(mocks.anotherWorkoutExerciseId, mocks.exerciseTarget, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("happy path", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseTargetSetEvent]);
  });

  test("happy path - in progress", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseTargetSetEvent]);
  });
});
