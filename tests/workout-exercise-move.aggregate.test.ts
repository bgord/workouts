import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.moveExercise", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutIsEditable", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
        mocks.GenericWorkoutCompletedEvent,
      ],
      deps,
    );

    expect(() =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.anotherWorkoutExercisePosition, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutIsEditable.error);
  });

  test("WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
      ],
      deps,
    );

    expect(() =>
      workout.moveExercise(
        mocks.workoutExerciseId,
        mocks.anotherWorkoutExercisePosition,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("WorkoutExerciseExists", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.moveExercise(mocks.anotherWorkoutExerciseId, mocks.workoutExercisePosition, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("WorkoutExercisePositionInRange", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.anotherWorkoutExercisePosition, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExercisePositionInRange.error);
  });

  test("WorkoutExercisePositionHasChanged", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
      ],
      deps,
    );

    expect(() =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.workoutExercisePosition, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExercisePositionHasChanged.error);
  });

  test("happy path", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.anotherWorkoutExercisePosition, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseMovedEvent]);
    expect(workout.exercises.map((exercise) => exercise.id)).toEqual([
      mocks.anotherWorkoutExerciseId,
      mocks.workoutExerciseId,
    ]);
  });

  test("happy path - back to the front", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
        mocks.GenericWorkoutExerciseMovedEvent,
      ],
      deps,
    );

    expect(workout.exercises.map((exercise) => exercise.id)).toEqual([
      mocks.anotherWorkoutExerciseId,
      mocks.workoutExerciseId,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.workoutExercisePosition, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([
      {
        ...mocks.GenericWorkoutExerciseMovedEvent,
        payload: {
          ...mocks.GenericWorkoutExerciseMovedEvent.payload,
          position: mocks.workoutExercisePosition,
        },
      },
    ]);
    expect(workout.exercises.map((exercise) => exercise.id)).toEqual([
      mocks.workoutExerciseId,
      mocks.anotherWorkoutExerciseId,
    ]);
  });

  test("happy path - in progress keeps the logged sets", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.anotherWorkoutExercisePosition, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseMovedEvent]);
    expect(workout.exercises[1]?.id).toEqual(mocks.workoutExerciseId);
    expect(workout.exercises[1]?.loggedSets).toEqual([mocks.GenericWorkoutSetLoggedEvent.payload.loggedSet]);
  });
});
