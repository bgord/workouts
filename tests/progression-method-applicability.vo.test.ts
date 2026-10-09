import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";
import * as Plans from "+plans";

describe("ProgressionMethodApplicability", () => {
  test("options - weighted", () => {
    expect(
      Plans.VO.ProgressionMethodApplicability.options(Exercises.VO.ExerciseResistanceOptions.weighted),
    ).toEqual([
      Plans.VO.ProgressionMethodOptions.double_progression,
      Plans.VO.ProgressionMethodOptions.linear_progression,
      Plans.VO.ProgressionMethodOptions.rep_progression,
      Plans.VO.ProgressionMethodOptions.none,
    ]);
  });

  test("options - bodyweight", () => {
    expect(
      Plans.VO.ProgressionMethodApplicability.options(Exercises.VO.ExerciseResistanceOptions.bodyweight),
    ).toEqual([
      Plans.VO.ProgressionMethodOptions.double_progression,
      Plans.VO.ProgressionMethodOptions.rep_progression,
      Plans.VO.ProgressionMethodOptions.none,
    ]);
  });

  test("isApplicable - weighted linear_progression", () => {
    expect(
      Plans.VO.ProgressionMethodApplicability.isApplicable(
        Exercises.VO.ExerciseResistanceOptions.weighted,
        Plans.VO.ProgressionMethodOptions.linear_progression,
      ),
    ).toEqual(true);
  });

  test("isApplicable - bodyweight linear_progression", () => {
    expect(
      Plans.VO.ProgressionMethodApplicability.isApplicable(
        Exercises.VO.ExerciseResistanceOptions.bodyweight,
        Plans.VO.ProgressionMethodOptions.linear_progression,
      ),
    ).toEqual(false);
  });
});
