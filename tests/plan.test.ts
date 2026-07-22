import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan", async () => {
  const di = await bootstrap();

  test("build new aggregate", () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(plan.pullEvents()).toEqual([]);
  });

  test("createDraft", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const plan = Plans.Aggregates.Plan.createDraft(
        mocks.planId,
        mocks.planName,
        mocks.userId,
        di.Adapters.System,
      );

      expect(plan.pullEvents()).toEqual([mocks.GenericPlanDraftCreatedEvent]);
    });
  });

  test("createSection - first", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCreatedEvent]);
  });

  test("createSection - at the limit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 4)],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCreatedEvent]);
  });

  test("createSection - PlanIsEditable", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanSectionLimitForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 5)],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionLimitForPlan.error,
    );
  });
});
