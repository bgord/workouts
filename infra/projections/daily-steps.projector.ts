import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    measurements.Events.DailyStepsRecordedEventType | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class DailyStepsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      measurements.Events.DAILY_STEPS_RECORDED_EVENT,
      deps.EventHandler.handle(this.onDailyStepsRecordedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onDailyStepsRecordedEvent(event: measurements.Events.DailyStepsRecordedEventType) {
    await db
      .insert(Schema.dailySteps)
      .values({
        userId: event.payload.userId,
        day: event.payload.day,
        count: event.payload.count,
        source: event.payload.source,
        createdAt: event.createdAt,
        updatedAt: event.createdAt,
      })
      .onConflictDoUpdate({
        target: [Schema.dailySteps.userId, Schema.dailySteps.day],
        set: { count: event.payload.count, source: event.payload.source, updatedAt: event.createdAt },
      });
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.dailySteps).where(eq(Schema.dailySteps.userId, event.payload.userId));
  }
}
