import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import { ActionBlocker, ActionState } from "+action-state";
import * as Exercises from "+exercises";
import * as mocks from "./mocks";

describe("ActionBlocker", () => {
  test("from - passes", () => {
    const blocker = ActionBlocker.from(Exercises.Invariants.ExerciseIsNotUsed, {
      count: tools.Int.nonNegative(0),
    });

    expect(blocker).toEqual({ passes: true, hint: "exercise.is.not.used" });
  });

  test("from - fails", () => {
    const blocker = ActionBlocker.from(Exercises.Invariants.ExerciseIsNotUsed, {
      count: tools.Int.nonNegative(1),
    });

    expect(blocker).toEqual({ passes: false, hint: "exercise.is.not.used" });
  });
});

describe("ActionState", () => {
  test("of - available", () => {
    expect(ActionState.of(true)).toEqual(mocks.actionAvailable);
  });

  test("of - unavailable", () => {
    expect(ActionState.of(false)).toEqual(mocks.actionUnavailable);
  });

  test("of - available - passing blockers", () => {
    expect(ActionState.of(true, [{ passes: true, hint: "first" }])).toEqual(mocks.actionAvailable);
  });

  test("of - available - failing blockers", () => {
    expect(
      ActionState.of(true, [
        { passes: false, hint: "first" },
        { passes: true, hint: "second" },
        { passes: false, hint: "third" },
      ]),
    ).toEqual({ available: true, enabled: false, hints: ["first", "third"] });
  });

  test("of - unavailable - failing blockers", () => {
    expect(ActionState.of(false, [{ passes: false, hint: "first" }])).toEqual(mocks.actionUnavailable);
  });
});
