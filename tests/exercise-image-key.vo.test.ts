import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

describe("ExerciseImageKeyFactory", () => {
  test("stable", () => {
    expect(Exercises.VO.ExerciseImageKeyFactory.stable(mocks.exerciseId)).toEqual(mocks.exerciseImageKey);
  });
});
