import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.setSectionCooldown", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    expect(() =>
      plan.setSectionCooldown(mocks.planSectionId, mocks.planSectionCooldown, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planFinalizedHistory, deps);

    expect(() =>
      plan.setSectionCooldown(mocks.planSectionId, mocks.planSectionCooldown, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.setSectionCooldown(mocks.planSectionId, mocks.planSectionCooldown, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.setSectionCooldown(mocks.anotherPlanSectionId, mocks.planSectionCooldown, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("PlanSectionCooldownHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCooldownSetEvent,
      ],
      deps,
    );

    expect(() =>
      plan.setSectionCooldown(mocks.planSectionId, mocks.planSectionCooldown, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionCooldownHasChanged.error);
  });

  test("PlanSectionCooldownHasChanged - clearing an absent cooldown", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.setSectionCooldown(mocks.planSectionId, undefined, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionCooldownHasChanged.error,
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
      plan.setSectionCooldown(mocks.planSectionId, mocks.planSectionCooldown, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCooldownSetEvent]);
    expect(plan.sections).toEqual([
      { id: mocks.anotherPlanSectionId, name: mocks.thirdPlanSectionName, exerciseInstructions: [] },
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        cooldown: mocks.planSectionCooldown,
        exerciseInstructions: [],
      },
    ]);
  });

  test("happy path - matches the targeted section, not the first one", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEventThird,
        mocks.GenericPlanSectionCreatedEvent,
        {
          ...mocks.GenericPlanSectionCooldownSetEvent,
          payload: {
            ...mocks.GenericPlanSectionCooldownSetEvent.payload,
            planSectionId: mocks.anotherPlanSectionId,
          },
        },
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.setSectionCooldown(mocks.planSectionId, mocks.planSectionCooldown, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCooldownSetEvent]);
  });

  test("happy path - clears an existing cooldown", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCooldownSetEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.setSectionCooldown(mocks.planSectionId, undefined, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCooldownUnsetEvent]);
    expect(plan.sections).toEqual([
      { id: mocks.planSectionId, name: mocks.planSectionName, cooldown: undefined, exerciseInstructions: [] },
    ]);
  });
});
