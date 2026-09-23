import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutGetExerciseActions", () => {
  test("draft - first", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      exercise: mocks.workoutExercise,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionAvailable,
      remove: mocks.actionAvailable,
      moveUp: { available: true, enabled: false, hints: ["workout.exercise.position.has.changed"] },
      moveDown: mocks.actionAvailable,
      setLog: mocks.actionUnavailable,
    });
  });

  test("draft - last", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      exercise: mocks.workoutExerciseWithoutTarget,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionAvailable,
      remove: mocks.actionAvailable,
      moveUp: mocks.actionAvailable,
      moveDown: { available: true, enabled: false, hints: ["workout.exercise.position.in.range"] },
      setLog: mocks.actionUnavailable,
    });
  });

  test("in progress", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      exercise: mocks.workoutExercise,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionUnavailable,
      remove: mocks.actionAvailable,
      moveUp: { available: true, enabled: false, hints: ["workout.exercise.position.has.changed"] },
      moveDown: mocks.actionAvailable,
      setLog: mocks.actionAvailable,
    });
  });

  test("in progress - exercise without a target", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      exercise: mocks.workoutExerciseWithoutTarget,
    });

    expect(actions.calculate().targetSet).toEqual(mocks.actionAvailable);
  });

  test("completed", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.completed,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      exercise: mocks.workoutExercise,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionUnavailable,
      remove: mocks.actionUnavailable,
      moveUp: mocks.actionUnavailable,
      moveDown: mocks.actionUnavailable,
      setLog: mocks.actionUnavailable,
    });
  });
});
