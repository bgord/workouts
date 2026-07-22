import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import * as Plans from "+plans";
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
});
