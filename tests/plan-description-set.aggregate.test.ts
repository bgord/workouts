import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.setDescription", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    expect(() => plan.setDescription(mocks.planDescription, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planFinalizedHistory, deps);

    expect(() => plan.setDescription(mocks.planDescription, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.setDescription(mocks.planDescription, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("PlanDescriptionHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanDescriptionSetEvent],
      deps,
    );

    expect(() => plan.setDescription(mocks.planDescription, mocks.userId)).toThrow(
      Plans.Invariants.PlanDescriptionHasChanged.error,
    );
  });

  test("PlanDescriptionHasChanged - clearing an absent description", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.setDescription(undefined, mocks.userId)).toThrow(
      Plans.Invariants.PlanDescriptionHasChanged.error,
    );
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.setDescription(mocks.planDescription, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanDescriptionSetEvent]);
  });

  test("happy path - clears an existing description", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanDescriptionSetEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.setDescription(undefined, mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanDescriptionUnsetEvent]);
  });
});
