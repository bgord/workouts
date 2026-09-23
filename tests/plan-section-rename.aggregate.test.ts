import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.renameSection", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planFinalizedHistory, deps);

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.renameSection(mocks.anotherPlanSectionId, mocks.anotherPlanSectionName, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEventThird,
        mocks.GenericPlanSectionCreatedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionRenamedEvent]);
    expect(plan.sections).toEqual([
      { id: mocks.anotherPlanSectionId, name: mocks.thirdPlanSectionName, exerciseInstructions: [] },
      { id: mocks.planSectionId, name: mocks.anotherPlanSectionName, exerciseInstructions: [] },
    ]);
  });
});
