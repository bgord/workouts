import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.logSet", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("WorkoutIsInProgress", async () => {
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
      workout.logSet(
        mocks.workoutExerciseId,
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutIsInProgress.error);
  });

  test("WorkoutBelongsToUser", async () => {
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
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("WorkoutExerciseExists", async () => {
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
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("happy path", async () => {
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
      workout.logSet(
        mocks.workoutExerciseId,
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetLoggedEvent]);
  });

  test("happy path - twice", async () => {
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
        mocks.anotherLoggedSet.id,
        mocks.anotherLoggedSet.reps,
        mocks.anotherLoggedSet.load,
        mocks.anotherLoggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetLoggedEventAnother]);
  });

  test("happy path - the set number is counted per exercise", async () => {
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
      workout.logSet(
        mocks.anotherWorkoutExerciseId,
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([
      {
        ...mocks.GenericWorkoutSetLoggedEvent,
        payload: {
          ...mocks.GenericWorkoutSetLoggedEvent.payload,
          workoutExerciseId: mocks.anotherWorkoutExerciseId,
        },
      },
    ]);
  });
});
