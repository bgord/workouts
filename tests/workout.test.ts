import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("build - WorkoutExists", () => {
    expect(() => Workouts.Aggregates.Workout.build(mocks.workoutId, [], deps)).toThrow(
      Workouts.Invariants.WorkoutExists.error,
    );
  });

  test("build - no pending events", () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(workout.pullEvents()).toEqual([]);
  });

  test("create", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const workout = Workouts.Aggregates.Workout.create(
        mocks.workoutId,
        mocks.planId,
        mocks.workoutScheduledFor,
        mocks.userId,
        deps,
      );

      expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutCreatedEvent]);
    });
  });

  test("addExercise", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseAddedEvent]);
  });

  test("addExercise - WorkoutIsDraft", async () => {
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

    expect(() =>
      workout.addExercise(
        mocks.anotherWorkoutExerciseId,
        mocks.exerciseId,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutIsDraft.error);
  });

  test("addExercise - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.exercisePrescription,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("setExerciseTarget", async () => {
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

  test("setExerciseTarget - WorkoutIsDraft", async () => {
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

    expect(() =>
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutIsDraft.error);
  });

  test("setExerciseTarget - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.anotherUserId),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("setExerciseTarget - WorkoutExerciseExists", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.setExerciseTarget(mocks.anotherWorkoutExerciseId, mocks.exerciseTarget, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("start", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.start(mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutStartedEvent]);
  });

  test("start - WorkoutIsDraft", async () => {
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

    expect(() => workout.start(mocks.userId)).toThrow(Workouts.Invariants.WorkoutIsDraft.error);
  });

  test("start - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
      ],
      deps,
    );

    expect(() => workout.start(mocks.anotherUserId)).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("start - WorkoutIsReadyToStart - no exercises", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.start(mocks.userId)).toThrow(Workouts.Invariants.WorkoutIsReadyToStart.error);
  });

  test("start - WorkoutIsReadyToStart - exercise without a target", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() => workout.start(mocks.userId)).toThrow(Workouts.Invariants.WorkoutIsReadyToStart.error);
  });

  test("logSet", async () => {
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
      workout.logSet(mocks.workoutExerciseId, mocks.loggedSet.reps, mocks.loggedSet.load, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetLoggedEvent]);
  });

  test("logSet - twice", async () => {
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
      workout.logSet(
        mocks.workoutExerciseId,
        mocks.anotherLoggedSet.reps,
        mocks.anotherLoggedSet.load,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.AnotherGenericWorkoutSetLoggedEvent]);
  });

  test("logSet - WorkoutIsInProgress", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
      ],
      deps,
    );

    expect(() =>
      workout.logSet(mocks.workoutExerciseId, mocks.loggedSet.reps, mocks.loggedSet.load, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutIsInProgress.error);
  });

  test("logSet - WorkoutBelongsToUser", async () => {
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

    expect(() =>
      workout.logSet(
        mocks.workoutExerciseId,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("logSet - WorkoutExerciseExists", async () => {
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

    expect(() =>
      workout.logSet(
        mocks.anotherWorkoutExerciseId,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("complete", async () => {
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

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.complete(mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutCompletedEvent]);
  });

  test("complete - WorkoutIsInProgress", async () => {
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

    expect(() => workout.complete(mocks.userId)).toThrow(Workouts.Invariants.WorkoutIsInProgress.error);
  });

  test("complete - WorkoutBelongsToUser", async () => {
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

    expect(() => workout.complete(mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("complete - WorkoutHasLoggedSets", async () => {
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

    expect(() => workout.complete(mocks.userId)).toThrow(Workouts.Invariants.WorkoutHasLoggedSets.error);
  });
});
