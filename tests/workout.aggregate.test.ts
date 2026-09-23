/* cSpell:disable */
import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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

  test("build - WorkoutExists - discarded", () => {
    expect(() =>
      Workouts.Aggregates.Workout.build(
        mocks.workoutId,
        [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutDiscardedEvent],
        deps,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExists.error);
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
        mocks.planName,
        mocks.planSectionId,
        mocks.planSectionName,
        mocks.planSectionWarmup,
        mocks.planSectionCooldown,
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
        mocks.exerciseName,
        mocks.exerciseImageEtag,
        mocks.exerciseDescription,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseAddedEvent]);
  });

  test("addExercise - in progress", async () => {
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
        mocks.exerciseName,
        mocks.exerciseImageEtag,
        mocks.exerciseDescription,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseAddedEventAnother]);
  });

  test("addExercise - WorkoutIsEditable", async () => {
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
        mocks.exerciseName,
        mocks.exerciseImageEtag,
        mocks.exerciseDescription,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutIsEditable.error);
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
        mocks.exerciseName,
        mocks.exerciseImageEtag,
        mocks.exerciseDescription,
        mocks.exercisePrescription,
        mocks.anotherUserId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutBelongsToUser.error);
  });

  test("addExercise - WorkoutExerciseLimit", async () => {
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
        mocks.exerciseName,
        mocks.exerciseImageEtag,
        mocks.exerciseDescription,
        mocks.exercisePrescription,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseLimit.error);
  });

  test("removeExercise", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.removeExercise(mocks.workoutExerciseId, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseRemovedEvent]);
    expect(workout.exercises).toEqual([]);
  });

  test("removeExercise - in progress", async () => {
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
      workout.removeExercise(mocks.workoutExerciseId, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseRemovedEvent]);
    expect(workout.exercises).toEqual([]);
  });

  test("removeExercise - drops the logged sets along with the exercise", async () => {
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

    expect(workout.exercises[0]?.loggedSets).toEqual([mocks.GenericWorkoutSetLoggedEvent.payload.loggedSet]);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      workout.removeExercise(mocks.workoutExerciseId, mocks.userId),
    );

    expect(workout.exercises).toEqual([]);
  });

  test("removeExercise - WorkoutIsEditable", async () => {
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

    expect(() => workout.removeExercise(mocks.workoutExerciseId, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutIsEditable.error,
    );
  });

  test("removeExercise - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() => workout.removeExercise(mocks.workoutExerciseId, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("removeExercise - WorkoutExerciseExists", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() => workout.removeExercise(mocks.anotherWorkoutExerciseId, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutExerciseExists.error,
    );
  });

  test("moveExercise", async () => {
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

  test("moveExercise - back to the front", async () => {
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

  test("moveExercise - in progress keeps the logged sets", async () => {
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

  test("moveExercise - WorkoutIsEditable", async () => {
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

  test("moveExercise - WorkoutBelongsToUser", async () => {
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

  test("moveExercise - WorkoutExerciseExists", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.moveExercise(mocks.anotherWorkoutExerciseId, mocks.workoutExercisePosition, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("moveExercise - WorkoutExercisePositionInRange", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() =>
      workout.moveExercise(mocks.workoutExerciseId, mocks.anotherWorkoutExercisePosition, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutExercisePositionInRange.error);
  });

  test("moveExercise - WorkoutExercisePositionHasChanged", async () => {
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

  test("setExerciseTarget - in progress", async () => {
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
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.userId),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutExerciseTargetSetEvent]);
  });

  test("setExerciseTarget - WorkoutIsEditable", async () => {
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
      workout.setExerciseTarget(mocks.workoutExerciseId, mocks.exerciseTarget, mocks.userId),
    ).toThrow(Workouts.Invariants.WorkoutIsEditable.error);
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

  test("start - WorkoutHasExercises", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.start(mocks.userId)).toThrow(Workouts.Invariants.WorkoutHasExercises.error);
  });

  test("start - WorkoutExercisesHaveTargets", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
        mocks.GenericWorkoutExerciseTargetSetEvent,
      ],
      deps,
    );

    expect(() => workout.start(mocks.userId)).toThrow(Workouts.Invariants.WorkoutExercisesHaveTargets.error);
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
        mocks.anotherLoggedSet.id,
        mocks.anotherLoggedSet.reps,
        mocks.anotherLoggedSet.load,
        mocks.anotherLoggedSet.rir,
        mocks.userId,
      ),
    );

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutSetLoggedEventAnother]);
  });

  test("logSet - the set number is counted per exercise", async () => {
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
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
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
        mocks.loggedSet.id,
        mocks.loggedSet.reps,
        mocks.loggedSet.load,
        mocks.loggedSet.rir,
        mocks.userId,
      ),
    ).toThrow(Workouts.Invariants.WorkoutExerciseExists.error);
  });

  test("correctSet - in progress", async () => {
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

  test("correctSet - completed", async () => {
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

  test("correctSet - replaces the set rather than adding one", async () => {
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

  test("correctSet - WorkoutIsCorrectable - draft", async () => {
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

  test("correctSet - WorkoutLoggedSetExists", async () => {
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

  test("correctSet - WorkoutBelongsToUser", async () => {
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

  test("removeSet", async () => {
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

  test("removeSet - renumbers the surviving sets", () => {
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

  test("removeSet - WorkoutRetainsLoggedSets - completed with a single set", async () => {
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

  test("removeSet - in progress with a single set is allowed", async () => {
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

  test("removeSet - WorkoutLoggedSetExists", async () => {
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

  test("removeSet - WorkoutBelongsToUser", async () => {
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

  test("complete", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [
        mocks.GenericWorkoutCreatedEvent,
        mocks.GenericWorkoutExerciseAddedEvent,
        mocks.GenericWorkoutExerciseTargetSetEvent,
        mocks.GenericWorkoutExerciseAddedEventAnother,
        mocks.GenericWorkoutStartedEvent,
        mocks.GenericWorkoutSetLoggedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.complete(mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutCompletedEvent]);
    expect(workout.status).toEqual(Workouts.VO.WorkoutStatusEnum.completed);
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

  test("discard", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.discard(mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutDiscardedEvent]);
  });

  test("discard - in progress", async () => {
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

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.discard(mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutDiscardedEvent]);
  });

  test("discard - completed", async () => {
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

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.discard(mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutDiscardedEvent]);
  });

  test("discard - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutExerciseAddedEvent],
      deps,
    );

    expect(() => workout.discard(mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("setNote", async () => {
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

  test("setNote - clears an existing note", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutNoteSetEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => workout.setNote(undefined, mocks.userId));

    expect(workout.pullEvents()).toEqual([mocks.GenericWorkoutNoteUnsetEvent]);
  });

  test("setNote - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.setNote(mocks.workoutNote, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("setNote - WorkoutNoteHasChanged", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutNoteSetEvent],
      deps,
    );

    expect(() => workout.setNote(mocks.workoutNote, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutNoteHasChanged.error,
    );
  });

  test("setNote - WorkoutNoteHasChanged - clearing an absent note", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.setNote(undefined, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutNoteHasChanged.error,
    );
  });

  test("reschedule", async () => {
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

  test("reschedule - twice", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent, mocks.GenericWorkoutRescheduledEvent],
      deps,
    );

    expect(() => workout.reschedule(mocks.anotherWorkoutScheduledFor, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutScheduledForHasChanged.error,
    );
  });

  test("reschedule - WorkoutIsDraft", async () => {
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

  test("reschedule - WorkoutBelongsToUser", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.reschedule(mocks.anotherWorkoutScheduledFor, mocks.anotherUserId)).toThrow(
      Workouts.Invariants.WorkoutBelongsToUser.error,
    );
  });

  test("reschedule - WorkoutScheduledForHasChanged", async () => {
    const workout = Workouts.Aggregates.Workout.build(
      mocks.workoutId,
      [mocks.GenericWorkoutCreatedEvent],
      deps,
    );

    expect(() => workout.reschedule(mocks.workoutScheduledFor, mocks.userId)).toThrow(
      Workouts.Invariants.WorkoutScheduledForHasChanged.error,
    );
  });
});
