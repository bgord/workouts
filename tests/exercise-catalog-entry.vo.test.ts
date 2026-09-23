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

describe("ExerciseCatalogEntry", () => {
  test("happy path", () => {
    const result = v.parse(Exercises.VO.ExerciseCatalogEntry, entry);

    expect(result.image.get()).toEqual(mocks.exerciseImageKey);
  });

  test("rejects missing exerciseCategories", () => {
    const { exerciseCategories, ...incomplete } = entry;

    expect(v.safeParse(Exercises.VO.ExerciseCatalogEntry, incomplete).success).toEqual(false);
  });
});
