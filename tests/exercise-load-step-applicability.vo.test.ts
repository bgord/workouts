// cSpell:ignore Choosable
import { describe, expect, test } from "bun:test";
import * as Exercises from "+exercises";

describe("ExerciseLoadStepApplicability", () => {
  test("options - weighted", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.options(Exercises.VO.ExerciseResistanceOptions.weighted),
    ).toEqual([
      Exercises.VO.ExerciseLoadStepOptions.kg_1,
      Exercises.VO.ExerciseLoadStepOptions.kg_2_5,
      Exercises.VO.ExerciseLoadStepOptions.kg_5,
      Exercises.VO.ExerciseLoadStepOptions.kg_10,
      Exercises.VO.ExerciseLoadStepOptions.dumbbell_rack,
    ]);
  });

  test("options - bodyweight", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.options(Exercises.VO.ExerciseResistanceOptions.bodyweight),
    ).toEqual([Exercises.VO.ExerciseLoadStepOptions.none]);
  });

  test("isApplicable - weighted", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.isApplicable(
        Exercises.VO.ExerciseResistanceOptions.weighted,
        Exercises.VO.ExerciseLoadStepOptions.dumbbell_rack,
      ),
    ).toEqual(true);
  });

  test("isApplicable - weighted none", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.isApplicable(
        Exercises.VO.ExerciseResistanceOptions.weighted,
        Exercises.VO.ExerciseLoadStepOptions.none,
      ),
    ).toEqual(false);
  });

  test("isApplicable - bodyweight", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.isApplicable(
        Exercises.VO.ExerciseResistanceOptions.bodyweight,
        Exercises.VO.ExerciseLoadStepOptions.none,
      ),
    ).toEqual(true);
  });

  test("isApplicable - bodyweight kg_2_5", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.isApplicable(
        Exercises.VO.ExerciseResistanceOptions.bodyweight,
        Exercises.VO.ExerciseLoadStepOptions.kg_2_5,
      ),
    ).toEqual(false);
  });

  test("isChoosable - weighted", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.isChoosable(Exercises.VO.ExerciseResistanceOptions.weighted),
    ).toEqual(true);
  });

  test("isChoosable - bodyweight", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.isChoosable(
        Exercises.VO.ExerciseResistanceOptions.bodyweight,
      ),
    ).toEqual(false);
  });

  test("keep - applicable", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.keep(
        Exercises.VO.ExerciseResistanceOptions.weighted,
        Exercises.VO.ExerciseLoadStepOptions.kg_10,
      ),
    ).toEqual(Exercises.VO.ExerciseLoadStepOptions.kg_10);
  });

  test("keep - not applicable weighted", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.keep(
        Exercises.VO.ExerciseResistanceOptions.weighted,
        Exercises.VO.ExerciseLoadStepOptions.none,
      ),
    ).toEqual(Exercises.VO.ExerciseLoadStepOptions.kg_2_5);
  });

  test("keep - not applicable bodyweight", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.keep(
        Exercises.VO.ExerciseResistanceOptions.bodyweight,
        Exercises.VO.ExerciseLoadStepOptions.kg_10,
      ),
    ).toEqual(Exercises.VO.ExerciseLoadStepOptions.none);
  });

  test("keep - missing", () => {
    expect(
      Exercises.VO.ExerciseLoadStepApplicability.keep(
        Exercises.VO.ExerciseResistanceOptions.weighted,
        undefined,
      ),
    ).toEqual(Exercises.VO.ExerciseLoadStepOptions.kg_2_5);
  });
});
