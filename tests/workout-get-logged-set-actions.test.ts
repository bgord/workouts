import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutGetLoggedSetActions", () => {
  test("draft", () => {
    const actions = new Workouts.Services.WorkoutGetLoggedSetActions({
      status: Workouts.VO.WorkoutStatusEnum.draft,
      loggedSetCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate()).toEqual({
      correct: mocks.actionUnavailable,
      remove: mocks.actionUnavailable,
    });
  });

  test("in progress - last set", () => {
    const actions = new Workouts.Services.WorkoutGetLoggedSetActions({
      status: Workouts.VO.WorkoutStatusEnum.in_progress,
      loggedSetCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate()).toEqual({ correct: mocks.actionAvailable, remove: mocks.actionAvailable });
  });

  test("completed", () => {
    const actions = new Workouts.Services.WorkoutGetLoggedSetActions({
      status: Workouts.VO.WorkoutStatusEnum.completed,
      loggedSetCount: tools.Int.nonNegative(2),
    });

    expect(actions.calculate()).toEqual({ correct: mocks.actionAvailable, remove: mocks.actionAvailable });
  });

  test("completed - last set", () => {
    const actions = new Workouts.Services.WorkoutGetLoggedSetActions({
      status: Workouts.VO.WorkoutStatusEnum.completed,
      loggedSetCount: tools.Int.nonNegative(1),
    });

    expect(actions.calculate()).toEqual({
      correct: mocks.actionAvailable,
      remove: { available: true, enabled: false, hints: ["workout.retains.logged.sets"] },
    });
  });
});
