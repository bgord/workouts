import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("build", () => {
    const facility = Workouts.Aggregates.Workout.build(mocks.workoutId, [], deps);

    expect(facility.pullEvents()).toEqual([]);
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
});
