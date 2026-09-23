import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutListActions", () => {
  test("finalized plan", () => {
    const actions = new Workouts.Services.WorkoutListActions({
      plan: mocks.planSummary,
      draftCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate()).toEqual({ create: mocks.actionAvailable });
  });

  test("no finalized plan", () => {
    const actions = new Workouts.Services.WorkoutListActions({
      plan: null,
      draftCount: tools.Int.nonNegative(0),
    });

    expect(actions.calculate()).toEqual({
      create: { available: true, enabled: false, hints: ["workout.plan.ready"] },
    });
  });

  test("draft limit for owner", () => {
    const actions = new Workouts.Services.WorkoutListActions({
      plan: mocks.planSummary,
      draftCount: tools.Int.nonNegative(3),
    });

    expect(actions.calculate()).toEqual({
      create: { available: true, enabled: false, hints: ["workout.draft.limit.for.owner"] },
    });
  });

  test("no finalized plan and draft limit for owner", () => {
    const actions = new Workouts.Services.WorkoutListActions({
      plan: null,
      draftCount: tools.Int.nonNegative(3),
    });

    expect(actions.calculate()).toEqual({
      create: {
        available: true,
        enabled: false,
        hints: ["workout.plan.ready", "workout.draft.limit.for.owner"],
      },
    });
  });
});
