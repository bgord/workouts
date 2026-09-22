import { describe, expect, test } from "bun:test";
import * as Notifications from "+notifications";

describe("Comparison", () => {
  test("of - up", () => {
    expect(Notifications.VO.Comparison.of(5, 3)).toEqual({
      current: 5,
      previous: 3,
      delta: 2,
      direction: Notifications.VO.ComparisonDirections.up,
    });
  });

  test("of - down", () => {
    expect(Notifications.VO.Comparison.of(3, 5)).toEqual({
      current: 3,
      previous: 5,
      delta: -2,
      direction: Notifications.VO.ComparisonDirections.down,
    });
  });

  test("of - flat", () => {
    expect(Notifications.VO.Comparison.of(5, 5)).toEqual({
      current: 5,
      previous: 5,
      delta: 0,
      direction: Notifications.VO.ComparisonDirections.flat,
    });
  });

  test("of - unknown without previous", () => {
    expect(Notifications.VO.Comparison.of(5)).toEqual({
      current: 5,
      previous: undefined,
      delta: 0,
      direction: Notifications.VO.ComparisonDirections.unknown,
    });
  });
});
