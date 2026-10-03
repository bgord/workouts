import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.reschedule", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutIsDraft", async () => {
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

    expect(() => workout.reschedule(mocks.anotherWorkoutScheduledFor, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutIsDraft.error,
    );
  });

  test("WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.reschedule(mocks.anotherWorkoutScheduledFor, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("WorkoutScheduledForHasChanged", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.reschedule(mocks.workoutScheduledFor, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutScheduledForHasChanged.error,
    );
  });

  test("WorkoutScheduledForIsWithinHorizon", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() =>
      workout.reschedule(v.parse(Workouts.VO.WorkoutScheduledFor, "2999-12-31"), mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.error);
  });

  test("WorkoutScheduledForIsWithinHorizon - past", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() =>
      workout.reschedule(v.parse(Workouts.VO.WorkoutScheduledFor, "2000-01-01"), mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutScheduledForIsWithinHorizon.error);
  });

  test("happy path", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.reschedule(mocks.anotherWorkoutScheduledFor, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutRescheduledEvent]);
  });

  test("happy path - twice", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutRescheduledEvent],
      deps,
    );

    expect(() => workout.reschedule(mocks.anotherWorkoutScheduledFor, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutScheduledForHasChanged.error,
    );
  });
});
