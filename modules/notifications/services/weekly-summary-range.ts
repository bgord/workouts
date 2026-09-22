import type * as tools from "@bgord/tools";
import type { SupportedLanguages } from "+supported-languages";
import { locales } from "./weekly-summary-locales";

type LanguagesType = (typeof SupportedLanguages)[number];

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
