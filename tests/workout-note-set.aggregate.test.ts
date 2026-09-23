import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.setNote", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.setNote(mocks.workoutNote, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("WorkoutNoteHasChanged", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutNoteSetEvent],
      deps,
    );

    expect(() => workout.setNote(mocks.workoutNote, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutNoteHasChanged.error,
    );
  });

  test("WorkoutNoteHasChanged - clearing an absent note", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.setNote(undefined, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutNoteHasChanged.error,
    );
  });

  test("happy path", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.setNote(mocks.workoutNote, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutNoteSetEvent]);
  });

  test("happy path - clears an existing note", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutNoteSetEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.setNote(undefined, mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutNoteUnsetEvent]);
  });
});
