import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.enableEditing", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsFinalized - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("PlanIsFinalized - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planArchivedHistory,
      deps,
    );

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planFinalizedHistory,
      deps,
    );

    expect(() => plan.enableEditing(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planFinalizedHistory,
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.enableEditing(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanEditingEnabledEvent]);
  });
});
