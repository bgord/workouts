import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.remove", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsRemovable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planFinalizedHistory, deps);

    expect(() => plan.remove(mocks.userId)).toThrow(Plans.Invariants.PlanIsRemovable.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.remove(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("happy path - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.remove(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRemovedEvent]);
  });

  test("happy path - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.remove(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRemovedEvent]);
  });
});
