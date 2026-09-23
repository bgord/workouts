import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutGetActions", () => {
  test("draft", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [mocks.workoutExercise],
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate()).toEqual({
      start: mocks.actionAvailable,
      complete: mocks.actionUnavailable,
      discard: mocks.actionAvailable,
      exerciseAdd: mocks.actionAvailable,
      noteSet: mocks.actionAvailable,
      reschedule: mocks.actionAvailable,
      reorder: mocks.actionUnavailable,
    });
  });

  test("draft - no exercises", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [],
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate().start).toEqual({
      available: true,
      enabled: false,
      hints: ["workout.has.exercises"],
    });
  });

  test("draft - exercise without a target", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate().start).toEqual({
      available: true,
      enabled: false,
      hints: ["workout.exercises.have.targets"],
    });
  });

  test("draft - in progress limit for owner", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [mocks.workoutExercise],
      inProgressCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate().start).toEqual({
      available: true,
      enabled: false,
      hints: ["workout.in.progress.limit.for.owner"],
    });
  });

  test("draft - no exercises and in progress limit for owner", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: [],
      inProgressCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate().start).toEqual({
      available: true,
      enabled: false,
      hints: ["workout.has.exercises", "workout.in.progress.limit.for.owner"],
    });
  });

  test("draft - exercise limit", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      exercises: mocks.workoutExercisesAtLimit,
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate().exerciseAdd).toEqual({
      available: true,
      enabled: false,
      hints: ["workout.exercise.limit"],
    });
  });

  test("in progress", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercises: [mocks.workoutExercise, mocks.workoutExerciseWithoutTarget],
      inProgressCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate()).toEqual({
      start: mocks.actionUnavailable,
      complete: mocks.actionAvailable,
      discard: mocks.actionAvailable,
      exerciseAdd: mocks.actionAvailable,
      noteSet: mocks.actionAvailable,
      reschedule: mocks.actionUnavailable,
      reorder: mocks.actionAvailable,
    });
  });

  test("in progress - single exercise", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercises: [mocks.workoutExercise],
      inProgressCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate().reorder).toEqual(mocks.actionUnavailable);
  });

  test("in progress - no logged sets", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      exercises: [mocks.workoutExerciseWithoutTarget],
      inProgressCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate().complete).toEqual({
      available: true,
      enabled: false,
      hints: ["workout.has.logged.sets"],
    });
  });

  test("completed", () => {
    const actions = new Workouts.Services.WorkoutGetActions({
      status: Workouts.VO.WorkoutStatusEnum.completed,
      exercises: [mocks.workoutExercise],
      inProgressCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate()).toEqual({
      start: mocks.actionUnavailable,
      complete: mocks.actionUnavailable,
      discard: mocks.actionAvailable,
      exerciseAdd: mocks.actionUnavailable,
      noteSet: mocks.actionAvailable,
      reschedule: mocks.actionUnavailable,
      reorder: mocks.actionUnavailable,
    });
  });
});
