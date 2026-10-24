import * as bg from "@bgord/bun";
import * as Preferences from "+preferences";
import { PreferenceReader } from "./preference-reader.adapter";
import { PreferenceWriter } from "./preference-writer.adapter";
import { createUserLanguageOHQ } from "./user-language-ohq.adapter";
import { UserLanguageQuery } from "./user-language-query.adapter";

export function createPreferencesAdapters() {
  return {
    UserLanguageQuery,
    UserLanguageOHQ: createUserLanguageOHQ({ UserLanguageQuery }),
    PreferenceReader,
    PreferenceWriter,
    WeeklySummaryOHQ: new bg.Preferences.OHQ.PreferenceAdapter(
      Preferences.VO.WeeklySummaryPreference,
      PreferenceReader,
    ),
  };
}
