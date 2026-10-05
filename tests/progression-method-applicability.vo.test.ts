import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Plans from "+plans";

describe("applicableProgressionMethod", () => {
  test("happy path", () => {
    const result = Plans.VO.applicableProgressionMethod(
      Exercises.VO.ExerciseResistanceOptions.weighted,
      Plans.VO.ProgressionMethodOptions.linear_progression,
    );

    expect(result).toEqual(Plans.VO.ProgressionMethodOptions.linear_progression);
  });

  test("not applicable - falls back to double progression", () => {
    const result = Plans.VO.applicableProgressionMethod(
      Exercises.VO.ExerciseResistanceOptions.bodyweight,
      Plans.VO.ProgressionMethodOptions.linear_progression,
    );

    expect(result).toEqual(Plans.VO.ProgressionMethodOptions.double_progression);
  });

  test("empty - falls back to double progression", () => {
    const result = Plans.VO.applicableProgressionMethod(
      Exercises.VO.ExerciseResistanceOptions.bodyweight,
      undefined,
    );

    expect(result).toEqual(Plans.VO.ProgressionMethodOptions.double_progression);
  });
});
