import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | measurements.Events.DailyStepsRecordedEventType
    | measurements.Events.DailyStepsRemovedEventType
    | measurements.Events.DailyStepsGoalSetEventType
    | Auth.Events.AccountDeletedEventType
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
      measurements.Events.DAILY_STEPS_REMOVED_EVENT,
      deps.EventHandler.handle(this.onDailyStepsRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.DAILY_STEPS_GOAL_SET_EVENT,
      deps.EventHandler.handle(this.onDailyStepsGoalSetEvent.bind(this)),
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

  async onDailyStepsRemovedEvent(event: measurements.Events.DailyStepsRemovedEventType) {
    await db
      .delete(Schema.dailySteps)
      .where(
        and(eq(Schema.dailySteps.userId, event.payload.userId), eq(Schema.dailySteps.day, event.payload.day)),
      );
  }

  async onDailyStepsGoalSetEvent(event: measurements.Events.DailyStepsGoalSetEventType) {
    await db
      .insert(Schema.dailyStepsGoals)
      .values({
        userId: event.payload.userId,
        goal: event.payload.goal,
        createdAt: event.createdAt,
        updatedAt: event.createdAt,
      })
      .onConflictDoUpdate({
        target: Schema.dailyStepsGoals.userId,
        set: { goal: event.payload.goal, updatedAt: event.createdAt },
      });
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.dailySteps).where(eq(Schema.dailySteps.userId, event.payload.userId));
    await db.delete(Schema.dailyStepsGoals).where(eq(Schema.dailyStepsGoals.userId, event.payload.userId));
  }
}
