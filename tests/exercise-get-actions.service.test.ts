import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

describe("ExerciseGetActions", () => {
  test("admin", () => {
    const actions = new Exercises.Services.ExerciseGetActions({
      requesterId: Auth.VO.ADMIN_USER_ID,
      resistance: mocks.exerciseResistance,
      usageCount: tools.Int.nonNegative(0),
      categories: [mocks.exerciseCategory],
      assignableCategories: [mocks.anotherExerciseCategory],
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionAvailable,
      imageChange: mocks.actionAvailable,
      loadStepSet: mocks.actionAvailable,
      delete: mocks.actionAvailable,
      categoryAssign: mocks.actionAvailable,
      categoryUnassign: mocks.actionAvailable,
    });
  });

  test("admin - blocked", () => {
    const actions = new Exercises.Services.ExerciseGetActions({
      requesterId: Auth.VO.ADMIN_USER_ID,
      resistance: mocks.exerciseResistance,
      usageCount: tools.Int.nonNegative(1),
      categories: [
        mocks.exerciseCategory,
        mocks.anotherExerciseCategory,
        mocks.exerciseCategory,
        mocks.anotherExerciseCategory,
        mocks.exerciseCategory,
      ],
      assignableCategories: [],
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionAvailable,
      imageChange: mocks.actionAvailable,
      loadStepSet: mocks.actionAvailable,
      delete: { available: true, enabled: false, hints: ["exercise.is.not.used"] },
      categoryAssign: {
        available: true,
        enabled: false,
        hints: ["exercise.category.limit", "exercise.category.assign.blocked.none_left"],
      },
      categoryUnassign: mocks.actionAvailable,
    });
  });

  test("admin - bodyweight", () => {
    const actions = new Exercises.Services.ExerciseGetActions({
      requesterId: Auth.VO.ADMIN_USER_ID,
      resistance: mocks.anotherExerciseResistance,
      usageCount: tools.Int.nonNegative(0),
      categories: [mocks.exerciseCategory],
      assignableCategories: [mocks.anotherExerciseCategory],
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionAvailable,
      imageChange: mocks.actionAvailable,
      loadStepSet: mocks.actionUnavailable,
      delete: mocks.actionAvailable,
      categoryAssign: mocks.actionAvailable,
      categoryUnassign: mocks.actionAvailable,
    });
  });

  test("user", () => {
    const actions = new Exercises.Services.ExerciseGetActions({
      requesterId: mocks.userId,
      resistance: mocks.exerciseResistance,
      usageCount: tools.Int.nonNegative(1),
      categories: [mocks.exerciseCategory],
      assignableCategories: [],
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionUnavailable,
      imageChange: mocks.actionUnavailable,
      loadStepSet: mocks.actionUnavailable,
      delete: mocks.actionUnavailable,
      categoryAssign: mocks.actionUnavailable,
      categoryUnassign: mocks.actionUnavailable,
    });
  });
});
