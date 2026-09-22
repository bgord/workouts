import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Notifications from "+notifications";
import * as Preferences from "+preferences";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklySummaryComposeJobHandler", async () => {
  const di = await bootstrap();

  const WeeklySummaryEmailRenderer: Notifications.Services.WeeklySummaryEmailRenderer = {
    render: async () => v.parse(bg.MailerContentHtml, "<html></html>"),
  };

  const handler = Notifications.JobHandlers.WeeklySummaryComposeJobHandler(
    { EMAIL_FROM: di.Env.EMAIL_FROM, BETTER_AUTH_URL: di.Env.BETTER_AUTH_URL },
    {
      ...di.Adapters.System,
      ...di.Tools,
      JobDispatcher: di.Tools.JobQueue,
      GetWeeklySummaryStatusQuery: di.Adapters.Notifications.GetWeeklySummaryStatusQuery,
      WeeklySummaryOHQ: di.Adapters.Preferences.GetWeeklySummaryQuery,
      UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
      UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
      ListWeekCompletedWorkoutsOHQ: di.Adapters.Workouts.ListWeekCompletedWorkoutsQuery,
      ListBodyWeightMeasurementsOHQ: di.Adapters.Measurements.ListBodyWeightMeasurementsQuery,
      WeeklySummaryEmailRenderer,
    },
  );

  test("already handled for the week", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Notifications.GetWeeklySummaryStatusQuery, "execute").mockResolvedValue(
        Notifications.VO.WeeklySummaryStatusEnum.sent,
      ),
    );
    using preference = spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute");
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    await handler(mocks.GenericWeeklySummaryComposeJob);

    expect(preference).not.toHaveBeenCalled();
    expect(enqueue).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("preference off", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Notifications.GetWeeklySummaryStatusQuery, "execute").mockResolvedValue(null),
    );
    spies.use(
      spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
        Preferences.VO.WeeklySummaryOptions.off,
      ),
    );
    using contact = spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary");
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    await handler(mocks.GenericWeeklySummaryComposeJob);

    expect(contact).not.toHaveBeenCalled();
    expect(enqueue).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("no contact", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Notifications.GetWeeklySummaryStatusQuery, "execute").mockResolvedValue(null),
    );
    spies.use(
      spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
        Preferences.VO.WeeklySummaryOptions.on,
      ),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined));
    using workouts = spyOn(di.Adapters.Workouts.ListWeekCompletedWorkoutsQuery, "execute");
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    await handler(mocks.GenericWeeklySummaryComposeJob);

    expect(workouts).not.toHaveBeenCalled();
    expect(enqueue).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("nothing to report", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Notifications.GetWeeklySummaryStatusQuery, "execute").mockResolvedValue(null),
    );
    spies.use(
      spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
        Preferences.VO.WeeklySummaryOptions.on,
      ),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.emailContact));
    spies.use(spyOn(di.Adapters.Workouts.ListWeekCompletedWorkoutsQuery, "execute").mockResolvedValue([]));
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      handler(mocks.GenericWeeklySummaryComposeJob),
    );

    expect(enqueue).not.toHaveBeenCalled();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklySummarySkippedEvent]);
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Notifications.GetWeeklySummaryStatusQuery, "execute").mockResolvedValue(null),
    );
    spies.use(
      spyOn(di.Adapters.Preferences.GetWeeklySummaryQuery, "execute").mockResolvedValue(
        Preferences.VO.WeeklySummaryOptions.on,
      ),
    );
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.emailContact));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue("en"));
    spies.use(
      spyOn(di.Adapters.Workouts.ListWeekCompletedWorkoutsQuery, "execute").mockImplementation(
        async (_, week) => (week.equals(mocks.week) ? [mocks.weekCompletedWorkout] : []),
      ),
    );
    spies.use(
      spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([]),
    );
    using enqueue = spyOn(di.Tools.JobQueue, "enqueue");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");
    using render = spyOn(WeeklySummaryEmailRenderer, "render");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      handler(mocks.GenericWeeklySummaryComposeJob),
    );

    expect(enqueue).toHaveBeenCalledWith({
      id: mocks.expectAnyId,
      correlationId: mocks.correlationId,
      createdAt: mocks.T0.ms,
      name: bg.System.Jobs.SEND_EMAIL_JOB,
      revision: mocks.revision.value,
      payload: {
        from: di.Env.EMAIL_FROM,
        to: mocks.email,
        subject: v.parse(bg.MailerSubject, "Your week in Workouts · 30 Dec – 5 Jan"),
        html: v.parse(bg.MailerContentHtml, "<html></html>"),
      },
    });
    expect(render).toHaveBeenCalledWith({
      ...mocks.weeklySummaryNotificationContent,
      footer: {
        ...mocks.weeklySummaryNotificationContent.footer,
        url: `${di.Env.BETTER_AUTH_URL}/profile`,
      },
    });
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklySummarySentEvent]);
    expect(eventStoreSave.mock.invocationCallOrder[0]).toBeLessThan(enqueue.mock.invocationCallOrder[0]!);
  });
});
