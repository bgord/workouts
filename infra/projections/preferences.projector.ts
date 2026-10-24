import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import type { PreferenceKeyType } from "+infra/adapters/preferences/preference-reader.adapter";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type AcceptedEvent =
  bg.Preferences.Events.UserLanguageSetEventType | bg.Preferences.Events.PreferenceSetEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  PreferenceWriter: bg.Preferences.Ports.PreferenceWriterPort<PreferenceKeyType>;
};

export class PreferencesProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      bg.Preferences.Events.USER_LANGUAGE_SET_EVENT,
      deps.EventHandler.handle(this.onUserLanguageSetEvent.bind(this)),
    );
    deps.EventBus.on(
      bg.Preferences.Events.PREFERENCE_SET_EVENT,
      deps.EventHandler.handle(
        bg.Preferences.EventHandlers.onPreferenceSetEvent(
          Preferences.VO.PreferenceDefinitions,
          deps.PreferenceWriter,
        ),
      ),
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
