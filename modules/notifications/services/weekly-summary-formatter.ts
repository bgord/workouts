import type * as tools from "@bgord/tools";
import type { SupportedLanguages } from "+supported-languages";

type LanguagesType = (typeof SupportedLanguages)[number];

const GRAMS_IN_KILOGRAM = 1000;

const locales: Record<LanguagesType, string> = { en: "en-GB", pl: "pl-PL" };

export enum WeightFormats {
  load = "load",
  volume = "volume",
  bodyWeight = "body_weight",
}

const precisions: Record<WeightFormats, Intl.NumberFormatOptions> = {
  [WeightFormats.load]: { maximumFractionDigits: 2 },
  [WeightFormats.volume]: { maximumFractionDigits: 0, useGrouping: "always" },
  [WeightFormats.bodyWeight]: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
};

const weightFormats = (
  locale: string,
  signDisplay?: Intl.NumberFormatOptions["signDisplay"],
): Record<WeightFormats, Intl.NumberFormat> => ({
  [WeightFormats.load]: new Intl.NumberFormat(locale, { ...precisions[WeightFormats.load], signDisplay }),
  [WeightFormats.volume]: new Intl.NumberFormat(locale, { ...precisions[WeightFormats.volume], signDisplay }),
  [WeightFormats.bodyWeight]: new Intl.NumberFormat(locale, {
    ...precisions[WeightFormats.bodyWeight],
    signDisplay,
  }),
});

export class WeeklySummaryFormatter {
  private readonly integerFormat: Intl.NumberFormat;
  private readonly signedFormat: Intl.NumberFormat;
  private readonly weightFormats: Record<WeightFormats, Intl.NumberFormat>;
  private readonly signedWeightFormats: Record<WeightFormats, Intl.NumberFormat>;
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
    this.weightFormats = weightFormats(locale);
    this.signedWeightFormats = weightFormats(locale, "always");
    this.dayFormat = new Intl.DateTimeFormat(locale, { timeZone: "UTC", day: "numeric", month: "short" });
    this.plural = new Intl.PluralRules(locale);
  }

  integer(value: number) {
    return this.integerFormat.format(value);
  }

  signed(value: number) {
    return this.signedFormat.format(value);
  }

  weight(grams: number, format: WeightFormats) {
    return this.weightFormats[format].format(grams / GRAMS_IN_KILOGRAM);
  }

  signedWeight(grams: number, format: WeightFormats) {
    return this.signedWeightFormats[format].format(grams / GRAMS_IN_KILOGRAM);
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
