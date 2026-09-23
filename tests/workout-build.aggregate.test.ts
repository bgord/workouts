import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.build", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutExists", () => {
    expect(() => Workouts.Aggregates.Workout.build(mocks.workoutId, [], deps)).toThrow(
      Workouts.Invariants.WorkoutExists.error,
    );
  });

  test("WorkoutExists - discarded", () => {
    expect(() =>
      Workouts.Aggregates.Workout.build(
        mocks.workoutId,
        [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutDiscardedEvent],
        deps,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExists.error);
  });

  test("happy path - no pending events", () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(workout.pullEvents()).toEqual([]);
  });
});
