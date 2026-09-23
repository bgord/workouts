import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.removeExercise", async () => {
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

    expect(() => workout.removeExercise(mocks.workoutExerciseId, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutIsEditable.error,
    );
  });

  test("WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() => workout.removeExercise(mocks.workoutExerciseId, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("WorkoutExerciseExists", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() => workout.removeExercise(mocks.anotherWorkoutExerciseId, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutExerciseExists.error,
    );
  });

  test("happy path", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.removeExercise(mocks.workoutExerciseId, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseRemovedEvent]);
    expect(workout.exercises).toEqual([]);
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
      workout.removeExercise(mocks.workoutExerciseId, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseRemovedEvent]);
    expect(workout.exercises).toEqual([]);
  });

  test("happy path - drops the logged sets along with the exercise", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
      ],
      deps,
    );

    expect(workout.exercises[0]?.loggedSets).toEqual([mocks.GenericWorkoutSetLoggedEvent.payload.loggedSet]);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.removeExercise(mocks.workoutExerciseId, mocks.userId),
    );

    expect(workout.exercises).toEqual([]);
  });
});
