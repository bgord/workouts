import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type AcceptedEvent =
  | bg.Preferences.Events.UserLanguageSetEventType
  | Preferences.Events.WeeklySummarySetEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
};

export class PreferencesProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      bg.Preferences.Events.USER_LANGUAGE_SET_EVENT,
      deps.EventHandler.handle(this.onUserLanguageSetEvent.bind(this)),
    );
    deps.EventBus.on(
      Preferences.Events.WEEKLY_SUMMARY_SET_EVENT,
      deps.EventHandler.handle(this.onWeeklySummarySetEvent.bind(this)),
    );
  }

  async onUserLanguageSetEvent(event: bg.Preferences.Events.UserLanguageSetEventType) {
    await db
      .insert(Schema.userPreferences)
      .values({
        userId: event.payload.userId,
        preference: "language",
        value: event.payload.language,
        updatedAt: event.createdAt,
      })
      .onConflictDoUpdate({
        target: [Schema.userPreferences.userId, Schema.userPreferences.preference],
        set: { value: event.payload.language, updatedAt: event.createdAt },
      });
  }
}
