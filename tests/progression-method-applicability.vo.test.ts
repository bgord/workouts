import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Plans from "+plans";

describe("applicableProgressionMethod", () => {
  test("happy path", () => {
    const result = Plans.VO.applicableProgressionMethod(
      Exercises.VO.ExerciseLoadingOptions.external,
      Plans.VO.ProgressionMethodOptions.linear_progression,
    );

    expect(result).toEqual(Plans.VO.ProgressionMethodOptions.linear_progression);
  });

  test("not applicable - falls back to double progression", () => {
    const result = Plans.VO.applicableProgressionMethod(
      Exercises.VO.ExerciseLoadingOptions.none,
      Plans.VO.ProgressionMethodOptions.linear_progression,
    );

    expect(result).toEqual(Plans.VO.ProgressionMethodOptions.double_progression);
  });

  test("empty - falls back to double progression", () => {
    const result = Plans.VO.applicableProgressionMethod(Exercises.VO.ExerciseLoadingOptions.none, undefined);

    expect(result).toEqual(Plans.VO.ProgressionMethodOptions.double_progression);
  });
});
