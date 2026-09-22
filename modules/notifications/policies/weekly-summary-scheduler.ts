import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Notifications from "+notifications";
import { WeeklySummarySchedule } from "../invariants/weekly-summary-schedule";
import { WeeklySummaryComposeJobSchema } from "../jobs/WEEKLY_SUMMARY_COMPOSE_JOB";

type AcceptedEvent = bg.System.Events.HourHasPassedEventType;
type AcceptedJob = Notifications.Jobs.WeeklySummaryComposeJobType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  JobDispatcher: bg.JobDispatcherPort<AcceptedJob>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Logger: bg.LoggerPort;
  UserDirectoryOHQ: Auth.OHQ.UserDirectoryOHQ;
};

export class WeeklySummaryScheduler {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      bg.System.Events.HOUR_HAS_PASSED_EVENT,
      deps.EventHandler.handle(this.onHourHasPassedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onHourHasPassedEvent(event: bg.System.Events.HourHasPassedEventType) {
    if (!WeeklySummarySchedule.passes({ timestamp: event.payload.timestamp })) return;

    const weekIsoId = tools.Week.fromTimestampValue(event.payload.timestamp).previous().toIsoId();

    const userIds = await this.deps.UserDirectoryOHQ.listActiveUserIds();

    for (const userId of userIds) {
      const job = bg.job(WeeklySummaryComposeJobSchema, { userId, weekIsoId }, this.deps);

      try {
        await this.deps.JobDispatcher.enqueue(job);
      } catch (error) {
        this.deps.Logger.error({
          message: "Weekly summary compose job enqueue failed",
          component: "notifications",
          operation: "weekly_summary_scheduler_on_hour_has_passed_event",
          error,
          correlationId: event.correlationId,
          metadata: { userId, weekIsoId },
        });
      }
    }
  }
}
