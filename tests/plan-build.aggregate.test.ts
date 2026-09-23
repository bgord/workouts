import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.build", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanExists", () => {
    expect(() => Plans.Aggregates.Plan.build(mocks.planId, [], deps)).toThrow(
      Plans.Invariants.PlanExists.error,
    );
  });

  test("PlanExists - removed", () => {
    expect(() =>
      Plans.Aggregates.Plan.build(
        mocks.planId,
        [mocks.GenericPlanCreatedEvent, mocks.GenericPlanRemovedEvent],
        deps,
      ),
    ).toThrow(Plans.Invariants.PlanExists.error);
  });

  test("happy path - no pending events", () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(plan.pullEvents()).toEqual([]);
  });
});
