import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";

describe("ExerciseCategoryRoleWeight", () => {
  test("of - primary", () => {
    expect(
      Exercises.VO.ExerciseCategoryRoleWeight.of(Exercises.VO.ExerciseCategoryRoleOptions.primary),
    ).toEqual(1);
  });

  test("of - secondary", () => {
    expect(
      Exercises.VO.ExerciseCategoryRoleWeight.of(Exercises.VO.ExerciseCategoryRoleOptions.secondary),
    ).toEqual(0.5);
  });

  test("total", () => {
    expect(
      Exercises.VO.ExerciseCategoryRoleWeight.total({
        [Exercises.VO.ExerciseCategoryRoleOptions.primary]: 6,
        [Exercises.VO.ExerciseCategoryRoleOptions.secondary]: 3,
      }),
    ).toEqual(7.5);
  });
});
