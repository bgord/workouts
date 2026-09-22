import type * as tools from "@bgord/tools";
import type { SupportedLanguages } from "+supported-languages";

type LanguagesType = (typeof SupportedLanguages)[number];

const GRAMS_IN_KILOGRAM = 1000;

const locales: Record<LanguagesType, string> = { en: "en-GB", pl: "pl-PL" };

export class WeeklySummaryFormatter {
  private readonly integerFormat: Intl.NumberFormat;
  private readonly signedFormat: Intl.NumberFormat;
  private readonly loadFormat: Intl.NumberFormat;
  private readonly weightFormat: Intl.NumberFormat;
  private readonly signedWeightFormat: Intl.NumberFormat;
  private readonly dayFormat: Intl.DateTimeFormat;
  private readonly plural: Intl.PluralRules;

  constructor(language: LanguagesType) {
    const locale = locales[language];

    this.integerFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: "always" });
    this.signedFormat = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      useGrouping: "always",
      signDisplay: "always",
    });
    this.loadFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    this.weightFormat = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    this.signedWeightFormat = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: "always",
    });
    this.dayFormat = new Intl.DateTimeFormat(locale, { timeZone: "UTC", day: "numeric", month: "short" });
    this.plural = new Intl.PluralRules(locale);
  }

  integer(value: number) {
    return this.integerFormat.format(value);
  }

  signed(value: number) {
    return this.signedFormat.format(value);
  }

  load(grams: number) {
    return this.loadFormat.format(grams / GRAMS_IN_KILOGRAM);
  }

  kilograms(grams: number) {
    return this.integerFormat.format(grams / GRAMS_IN_KILOGRAM);
  }

  signedKilograms(grams: number) {
    return this.signedFormat.format(grams / GRAMS_IN_KILOGRAM);
  }

  weight(grams: number) {
    return this.weightFormat.format(grams / GRAMS_IN_KILOGRAM);
  }

  signedWeight(grams: number) {
    return this.signedWeightFormat.format(grams / GRAMS_IN_KILOGRAM);
  }

  range(week: tools.Week) {
    return `${this.dayFormat.format(week.getStart().ms)} – ${this.dayFormat.format(week.getEnd().ms)}`;
  }

  noun(count: number, forms: { singular: string; plural: string; genitive: string }) {
    const category = this.plural.select(count);

    if (category === "one") return forms.singular;
    if (category === "few") return forms.plural;
    if (category === "many") return forms.genitive;
    return forms.plural;
  }
}
