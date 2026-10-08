import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Plans from "+plans";

describe("RirTarget", () => {
  test("happy path", () => {
    expect(v.safeParse(Plans.VO.RirTarget, 0).success).toEqual(true);
  });

  test("happy path - at the limit", () => {
    expect(v.safeParse(Plans.VO.RirTarget, 5).success).toEqual(true);
  });

  test("rejects above the limit", () => {
    expect(() => v.parse(Plans.VO.RirTarget, 6)).toThrow("rir.target.range");
  });
});
