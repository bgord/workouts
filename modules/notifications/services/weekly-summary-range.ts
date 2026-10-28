import type * as tools from "@bgord/tools";
import type { SupportedLanguagesType } from "+supported-languages";
import { locales } from "./weekly-summary-locales";

export class WeeklySummaryRange {
  static of(week: tools.Week, language: SupportedLanguagesType): string {
    const day = new Intl.DateTimeFormat(locales[language], {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
    });

    return `${day.format(week.getStart().ms)} – ${day.format(week.getEnd().ms)}`;
  }
}
