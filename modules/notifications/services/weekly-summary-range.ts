import type * as tools from "@bgord/tools";
import type { SupportedLanguages } from "+supported-languages";

type LanguagesType = (typeof SupportedLanguages)[number];

const locales: Record<LanguagesType, string> = { en: "en-GB", pl: "pl-PL" };

export class WeeklySummaryRange {
  static of(week: tools.Week, language: LanguagesType): string {
    const day = new Intl.DateTimeFormat(locales[language], {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
    });

    return `${day.format(week.getStart().ms)} – ${day.format(week.getEnd().ms)}`;
  }
}
