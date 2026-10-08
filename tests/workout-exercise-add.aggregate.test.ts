import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Workout.addExercise", async () => {
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

    expect(() =>
      workout.addExercise(
        mocks.anotherWorkoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutIsEditable.error);
  });

  test("WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.exercisePrescription,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("WorkoutExerciseLimit", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        ...tools.repeat(mocks.GenericWorkoutExerciseAddedEvent, Workouts.VO.WorkoutExerciseLimitMax),
      ],
      deps,
    );

    expect(() =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseLimit.error);
  });

  test("WorkoutExerciseProgressionIsApplicableForReps", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.amrapDoubleProgressionExercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseProgressionIsApplicableForReps.error);
  });

  test("WorkoutExerciseRirIsApplicableForReps", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.amrapRirExercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseRirIsApplicableForReps.error);
  });

  test("happy path", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseAddedEvent]);
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
      workout.addExercise(
        mocks.anotherWorkoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseAddedEventAnother]);
  });

  test("happy path - rir", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.addExercise(
        mocks.workoutExerciseId,
        mocks.exerciseId,
        mocks.workoutExerciseName,
        mocks.workoutExerciseDescription,
        mocks.workoutExerciseResistance,
        mocks.workoutExerciseLaterality,
        mocks.rirExercisePrescription,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseAddedEventRir]);
  });
});
