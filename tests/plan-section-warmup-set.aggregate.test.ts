import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.setSectionWarmup", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planArchivedHistory, deps);

    expect(() => plan.setSectionWarmup(mocks.planSectionId, mocks.planSectionWarmup, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, mocks.planFinalizedHistory, deps);

    expect(() => plan.setSectionWarmup(mocks.planSectionId, mocks.planSectionWarmup, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.setSectionWarmup(mocks.planSectionId, mocks.planSectionWarmup, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.setSectionWarmup(mocks.anotherPlanSectionId, mocks.planSectionWarmup, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("PlanSectionWarmupHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionWarmupSetEvent,
      ],
      deps,
    );

    expect(() => plan.setSectionWarmup(mocks.planSectionId, mocks.planSectionWarmup, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionWarmupHasChanged.error,
    );
  });

  test("PlanSectionWarmupHasChanged - clearing an absent warmup", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.setSectionWarmup(mocks.planSectionId, undefined, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionWarmupHasChanged.error,
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
      plan.setSectionWarmup(mocks.planSectionId, mocks.planSectionWarmup, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionWarmupSetEvent]);
    expect(plan.sections).toEqual([
      { id: mocks.anotherPlanSectionId, name: mocks.thirdPlanSectionName, exerciseInstructions: [] },
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        warmup: mocks.planSectionWarmup,
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
          ...mocks.GenericPlanSectionWarmupSetEvent,
          payload: {
            ...mocks.GenericPlanSectionWarmupSetEvent.payload,
            planSectionId: mocks.anotherPlanSectionId,
          },
        },
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.setSectionWarmup(mocks.planSectionId, mocks.planSectionWarmup, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionWarmupSetEvent]);
  });

  test("happy path - clears an existing warmup", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionWarmupSetEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.setSectionWarmup(mocks.planSectionId, undefined, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionWarmupUnsetEvent]);
    expect(plan.sections).toEqual([
      { id: mocks.planSectionId, name: mocks.planSectionName, warmup: undefined, exerciseInstructions: [] },
    ]);
  });
});
