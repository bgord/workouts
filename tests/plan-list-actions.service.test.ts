import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanListActions", () => {
  test("no active plan", () => {
    const actions = new Plans.Services.PlanListActions({ activeCount: tools.Int.nonNegative(0) });

    expect(actions.calculate()).toEqual({ create: mocks.actionAvailable });
  });

  test("active plan limit reached", () => {
    const actions = new Plans.Services.PlanListActions({ activeCount: tools.Int.nonNegative(1) });

    expect(actions.calculate()).toEqual({
      create: { available: true, enabled: false, hints: ["plan.limit.for.owner"] },
    });
  });
});
