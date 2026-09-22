import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Notifications from "+notifications";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklySummaryScheduler", async () => {
  const di = await bootstrap();
  const policy = new Notifications.Policies.WeeklySummaryScheduler({
    ...di.Tools,
    ...di.Adapters.System,
    JobDispatcher: di.Tools.JobQueue,
    UserDirectoryOHQ: di.Adapters.Auth.UserDirectoryOHQ,
  });

  test("onHourHasPassedEvent - outside schedule", async () => {
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using listActiveUserIds = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(listActiveUserIds).not.toHaveBeenCalled();
    expect(enqueue).not.toHaveBeenCalled();
  });

  test("onHourHasPassedEvent - no users", async () => {
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using _ = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondaySixAMEvent),
    );

    expect(enqueue).not.toHaveBeenCalled();
  });

  test("onHourHasPassedEvent - one failed enqueue does not stop the others", async () => {
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue")
      .mockRejectedValueOnce(new Error("busy"))
      .mockResolvedValueOnce(mocks.GenericWeeklySummaryComposeJob);
    using loggerError = spyOn(di.Adapters.System.Logger, "error");
    using _ = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([
      mocks.userId,
      mocks.anotherUserId,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondaySixAMEvent),
    );

    expect(enqueue).toHaveBeenCalledTimes(2);
    expect(loggerError).toHaveBeenCalledTimes(1);
  });

  test("onHourHasPassedEvent - one job per user", async () => {
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using _ = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([
      mocks.userId,
      mocks.anotherUserId,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondaySixAMEvent),
    );

    expect(enqueue).toHaveBeenCalledTimes(2);
    expect(enqueue).toHaveBeenNthCalledWith(1, mocks.GenericWeeklySummaryComposeJob);
    expect(enqueue).toHaveBeenNthCalledWith(2, {
      ...mocks.GenericWeeklySummaryComposeJob,
      payload: { userId: mocks.anotherUserId, weekIsoId: mocks.previousWeekIsoId },
    });
  });
});
