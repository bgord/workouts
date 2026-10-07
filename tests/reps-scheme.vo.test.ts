import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("RepsScheme", () => {
  test("range", () => {
    expect(Plans.VO.RepsScheme.of(mocks.repsRange)).toEqual(Plans.VO.RepsSchemeOptions.range);
  });

  test("amrap", () => {
    expect(Plans.VO.RepsScheme.of(mocks.amrapRepsRange)).toEqual(Plans.VO.RepsSchemeOptions.amrap);
  });
});
