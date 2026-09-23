import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.rename", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planArchivedHistory,
      deps,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planFinalizedHistory,
      deps,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.rename(mocks.anotherPlanName, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("PlanNameHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.rename(mocks.planName, mocks.userId)).toThrow(
      Plans.Invariants.PlanNameHasChanged.error,
    );
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.rename(mocks.anotherPlanName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRenamedEvent]);
  });
});
