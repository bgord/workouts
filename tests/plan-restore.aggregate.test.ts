import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.restore", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsRestorable - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("PlanIsRestorable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planFinalizedHistory, deps);

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    expect(() => plan.restore(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.restore(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRestoredEvent]);
  });
});
