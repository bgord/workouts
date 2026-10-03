import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";

describe("LoadStepLockedStrategy", () => {
  test("increase", () => {
    const strategy = new Workouts.Services.LoadStepLockedStrategy();

    const result = strategy.increase();

    expect(result).toEqual(undefined);
  });

  test("decrease", () => {
    const strategy = new Workouts.Services.LoadStepLockedStrategy();

    const result = strategy.decrease();

    expect(result).toEqual(undefined);
  });
});
