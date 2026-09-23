import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.removeSet", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutBelongsToUser", async () => {
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

    expect(() => workout.removeSet(mocks.workoutExerciseId, mocks.loggedSetId, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("WorkoutLoggedSetExists", async () => {
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

    expect(() => workout.removeSet(mocks.workoutExerciseId, mocks.loggedSetId, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutLoggedSetExists.error,
    );
  });

  test("WorkoutRetainsLoggedSets - completed with a single set", async () => {
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

    expect(() => workout.removeSet(mocks.workoutExerciseId, mocks.loggedSetId, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutRetainsLoggedSets.error,
    );
  });

  test("happy path", async () => {
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

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.removeSet(mocks.workoutExerciseId, mocks.loggedSetId, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetRemovedEvent]);
  });

  test("happy path - renumbers the surviving sets", () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
        mocks.GenericWorkoutSetLoggedEventAnother,
        mocks.GenericWorkoutSetRemovedEvent,
      ],
      deps,
    );

    // the id is stable, the ordinal is not: set 2 becomes set 1
    expect(workout.exercises[0]?.loggedSets).toEqual([
      { ...mocks.anotherLoggedSet, setNumber: mocks.loggedSet.setNumber },
    ]);
  });

  test("happy path - in progress with a single set is allowed", async () => {
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

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.removeSet(mocks.workoutExerciseId, mocks.loggedSetId, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetRemovedEvent]);
  });
});
