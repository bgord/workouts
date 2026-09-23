import { describe, expect, test } from "bun:test";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

describe("ExerciseListActions", () => {
  test("admin", () => {
    const actions = new Exercises.Services.ExerciseListActions({ requesterId: Auth.VO.ADMIN_USER_ID });

    expect(actions.calculate()).toEqual({ add: mocks.actionAvailable });
  });

  test("user", () => {
    const actions = new Exercises.Services.ExerciseListActions({ requesterId: mocks.userId });

    expect(actions.calculate()).toEqual({ add: mocks.actionUnavailable });
  });
});
