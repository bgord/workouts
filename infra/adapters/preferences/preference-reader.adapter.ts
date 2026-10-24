import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export type PreferenceKeyType = (typeof Schema.userPreferences.$inferSelect)["preference"];

class PreferenceReaderDrizzle implements bg.Preferences.Ports.PreferenceReaderPort<PreferenceKeyType> {
  async get(userId: Auth.VO.UserIdType, key: PreferenceKeyType): Promise<string | null> {
    const row = await db.query.userPreferences.findFirst({
      where: and(eq(Schema.userPreferences.userId, userId), eq(Schema.userPreferences.preference, key)),
      columns: { value: true },
    });

    return row?.value ?? null;
  }
}

export const PreferenceReader = new PreferenceReaderDrizzle();
