import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

describe("ExerciseImage", () => {
  test("key", () => {
    expect(Exercises.VO.ExerciseImage.key(mocks.exerciseId)).toEqual(mocks.exerciseImageKey);
  });
});
