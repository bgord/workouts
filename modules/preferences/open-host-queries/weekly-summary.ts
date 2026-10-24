import type * as bg from "@bgord/bun";
import type { WeeklySummaryPreference } from "+preferences/value-objects";

export type WeeklySummaryOHQ = bg.Preferences.OHQ.PreferencePort<typeof WeeklySummaryPreference>;
