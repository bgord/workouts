import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

const entry = {
  name: mocks.exerciseName,
  description: mocks.exerciseDescription,
  image: mocks.exerciseImageKey,
  exerciseCategories: [mocks.exerciseCategoryName],
};

describe("ExerciseCatalog", () => {
  test("happy path", () => {
    expect(v.safeParse(Exercises.VO.ExerciseCatalog, { exercises: [entry] }).success).toEqual(true);
  });

  test("rejects missing exercises", () => {
    expect(v.safeParse(Exercises.VO.ExerciseCatalog, {}).success).toEqual(false);
  });
});
