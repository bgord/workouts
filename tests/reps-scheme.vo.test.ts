import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("RepsScheme", () => {
  test("of - range", () => {
    expect(Plans.VO.RepsScheme.of(mocks.repsRange)).toEqual(Plans.VO.RepsSchemeOptions.range);
  });

  test("of - amrap", () => {
    expect(Plans.VO.RepsScheme.of(mocks.amrapRepsRange)).toEqual(Plans.VO.RepsSchemeOptions.amrap);
  });

  test("allowsProgression - range double_progression", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.range,
        Plans.VO.ProgressionMethodOptions.double_progression,
      ),
    ).toEqual(true);
  });

  test("allowsProgression - range linear_progression", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.range,
        Plans.VO.ProgressionMethodOptions.linear_progression,
      ),
    ).toEqual(true);
  });

  test("allowsProgression - range rep_progression", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.range,
        Plans.VO.ProgressionMethodOptions.rep_progression,
      ),
    ).toEqual(true);
  });

  test("allowsProgression - range none", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.range,
        Plans.VO.ProgressionMethodOptions.none,
      ),
    ).toEqual(true);
  });

  test("allowsProgression - amrap double_progression", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.amrap,
        Plans.VO.ProgressionMethodOptions.double_progression,
      ),
    ).toEqual(false);
  });

  test("allowsProgression - amrap linear_progression", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.amrap,
        Plans.VO.ProgressionMethodOptions.linear_progression,
      ),
    ).toEqual(true);
  });

  test("allowsProgression - amrap rep_progression", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.amrap,
        Plans.VO.ProgressionMethodOptions.rep_progression,
      ),
    ).toEqual(true);
  });

  test("allowsProgression - amrap none", () => {
    expect(
      Plans.VO.RepsScheme.allowsProgression(
        Plans.VO.RepsSchemeOptions.amrap,
        Plans.VO.ProgressionMethodOptions.none,
      ),
    ).toEqual(true);
  });

  test("allowsRir - range", () => {
    expect(Plans.VO.RepsScheme.allowsRir(Plans.VO.RepsSchemeOptions.range)).toEqual(true);
  });

  test("allowsRir - amrap", () => {
    expect(Plans.VO.RepsScheme.allowsRir(Plans.VO.RepsSchemeOptions.amrap)).toEqual(false);
  });
});
