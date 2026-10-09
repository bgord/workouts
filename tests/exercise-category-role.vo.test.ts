import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";

describe("ExerciseCategoryRole", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseCategoryRole, "secondary").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Exercises.VO.ExerciseCategoryRole, "invalid")).toThrow(
      "exercise.category.role.invalid",
    );
  });
});
