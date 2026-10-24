import type * as bg from "@bgord/bun";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { PreferenceKeyType } from "./preference-reader.adapter";

class PreferenceWriterDrizzle implements bg.Preferences.Ports.PreferenceWriterPort<PreferenceKeyType> {
  async set(input: bg.Preferences.Ports.PreferenceWriterInput<PreferenceKeyType>): Promise<void> {
    await db
      .insert(Schema.userPreferences)
      .values({ userId: input.userId, preference: input.key, value: input.value, updatedAt: input.at })
      .onConflictDoUpdate({
        target: [Schema.userPreferences.userId, Schema.userPreferences.preference],
        set: { value: input.value, updatedAt: input.at },
      });
  }
}

export const PreferenceWriter = new PreferenceWriterDrizzle();
