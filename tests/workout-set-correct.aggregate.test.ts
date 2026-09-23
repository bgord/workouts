import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.correctSet", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutIsCorrectable - draft", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.correctSet(
        mocks.workoutExerciseId,
        mocks.correctedLoggedSet.id,
        mocks.correctedLoggedSet.reps,
        mocks.correctedLoggedSet.load,
        mocks.correctedLoggedSet.rir,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutIsCorrectable.error);
  });

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

    expect(() =>
      workout.correctSet(
        mocks.workoutExerciseId,
        mocks.correctedLoggedSet.id,
        mocks.correctedLoggedSet.reps,
        mocks.correctedLoggedSet.load,
        mocks.correctedLoggedSet.rir,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
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

    expect(() =>
      workout.correctSet(
        mocks.workoutExerciseId,
        mocks.correctedLoggedSet.id,
        mocks.correctedLoggedSet.reps,
        mocks.correctedLoggedSet.load,
        mocks.correctedLoggedSet.rir,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutLoggedSetExists.error);
  });

  test("happy path - in progress", async () => {
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
      workout.correctSet(
        mocks.workoutExerciseId,
        mocks.correctedLoggedSet.id,
        mocks.correctedLoggedSet.reps,
        mocks.correctedLoggedSet.load,
        mocks.correctedLoggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetCorrectedEvent]);
  });

  test("happy path - completed", async () => {
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

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.correctSet(
        mocks.workoutExerciseId,
        mocks.correctedLoggedSet.id,
        mocks.correctedLoggedSet.reps,
        mocks.correctedLoggedSet.load,
        mocks.correctedLoggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetCorrectedEvent]);
  });

  test("happy path - replaces the set rather than adding one", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
        mocks.GenericWorkoutSetCorrectedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.logSet(
        mocks.workoutExerciseId,
        mocks.anotherLoggedSet.id,
        mocks.anotherLoggedSet.reps,
        mocks.anotherLoggedSet.load,
        mocks.anotherLoggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetLoggedEventAnother]);
  });
});
