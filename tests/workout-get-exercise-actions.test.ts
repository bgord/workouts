import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutGetExerciseActions", () => {
  test("draft", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercise: mocks.workoutExercise,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionAvailable,
      remove: mocks.actionAvailable,
      move: mocks.actionAvailable,
      setLog: mocks.actionUnavailable,
    });
  });

  test("in progress", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercise: mocks.workoutExercise,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionUnavailable,
      remove: mocks.actionAvailable,
      move: mocks.actionAvailable,
      setLog: mocks.actionAvailable,
    });
  });

  test("in progress - exercise without a target", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercise: mocks.workoutExerciseWithoutTarget,
    });

    expect(actions.calculate().targetSet).toEqual(mocks.actionAvailable);
  });

  test("completed", () => {
    const actions = new Workouts.Services.WorkoutGetExerciseActions({
      status: Workouts.VO.WorkoutStatusEnum.completed,
      exercise: mocks.workoutExercise,
    });

    expect(actions.calculate()).toEqual({
      targetSet: mocks.actionUnavailable,
      remove: mocks.actionUnavailable,
      move: mocks.actionUnavailable,
      setLog: mocks.actionUnavailable,
    });
  });
});
