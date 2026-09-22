import { describe, expect, test } from "bun:test";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

describe("ExerciseCategoryListActions", () => {
  test("admin", () => {
    const actions = new Exercises.Services.ExerciseCategoryListActions({
      requesterId: Auth.VO.ADMIN_USER_ID,
    });

    expect(actions.calculate()).toEqual({
      manage: mocks.actionAvailable,
      add: mocks.actionAvailable,
      rename: mocks.actionAvailable,
      delete: mocks.actionAvailable,
    });
  });

  test("user", () => {
    const actions = new Exercises.Services.ExerciseCategoryListActions({ requesterId: mocks.userId });

    expect(actions.calculate()).toEqual({
      manage: mocks.actionUnavailable,
      add: mocks.actionUnavailable,
      rename: mocks.actionUnavailable,
      delete: mocks.actionUnavailable,
    });
  });
});
