import { describe, expect, test } from "bun:test";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutLoggedSetExists", () => {
  test("passes - logged set present", () => {
    const config = { loggedSet: mocks.loggedSet };

    expect(Workouts.Invariants.WorkoutLoggedSetExists.passes(config)).toEqual(true);
  });

  test("fails - logged set absent", () => {
    const config = { loggedSet: undefined };

    expect(Workouts.Invariants.WorkoutLoggedSetExists.passes(config)).toEqual(false);
  });

  test("enforce - throws", () => {
    const config = { loggedSet: undefined };

    expect(() => Workouts.Invariants.WorkoutLoggedSetExists.enforce(config)).toThrow(
      Workouts.Invariants.WorkoutLoggedSetExists.error,
    );
  });
});
