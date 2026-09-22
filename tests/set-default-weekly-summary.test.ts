import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("SetDefaultWeeklySummary", async () => {
  const di = await bootstrap();
  registerEventHandlers(di.Env, di);
  registerCommandHandlers(di);

  const policy = new Preferences.Policies.SetDefaultWeeklySummary({ ...di.Adapters.System, ...di.Tools });

  test("onAccountCreatedEvent - no weekly summary set", async () => {
    using _ = spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
      Preferences.VO.WeeklySummaryOptions.off,
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onAccountCreatedEvent(mocks.GenericAccountCreatedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklySummarySetOnEvent]);
  });

  test("onAccountCreatedEvent - does not duplicate events", async () => {
    using _ = spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
      Preferences.VO.WeeklySummaryOptions.on,
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onAccountCreatedEvent(mocks.GenericAccountCreatedEvent);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
