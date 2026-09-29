import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Notifications from "+notifications";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Notifications.Events.WeeklySummarySentEventType
    | Notifications.Events.WeeklySummarySkippedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class WeeklySummariesProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Notifications.Events.WEEKLY_SUMMARY_SENT_EVENT,
      deps.EventHandler.handle(this.onWeeklySummarySentEvent.bind(this)),
    );
    deps.EventBus.on(
      Notifications.Events.WEEKLY_SUMMARY_SKIPPED_EVENT,
      deps.EventHandler.handle(this.onWeeklySummarySkippedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onWeeklySummarySentEvent(event: Notifications.Events.WeeklySummarySentEventType) {
    await db.insert(Schema.weeklySummaries).values({
      userId: event.payload.userId,
      weekIsoId: event.payload.weekIsoId,
      status: Notifications.VO.WeeklySummaryStatusEnum.sent,
      createdAt: event.createdAt,
    });
  }

  async onWeeklySummarySkippedEvent(event: Notifications.Events.WeeklySummarySkippedEventType) {
    await db.insert(Schema.weeklySummaries).values({
      userId: event.payload.userId,
      weekIsoId: event.payload.weekIsoId,
      status: Notifications.VO.WeeklySummaryStatusEnum.skipped,
      createdAt: event.createdAt,
    });
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.weeklySummaries).where(eq(Schema.weeklySummaries.userId, event.payload.userId));
  }
}
