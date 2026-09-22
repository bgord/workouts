import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Measurements from "+measurements";
import type { SupportedLanguages } from "+supported-languages";
import { locales } from "./weekly-summary-locales";

export type WeeklySummaryStat = { heading: string; value: string; caption: string; note?: string };

export class WeeklySummaryBodyWeight {
  private readonly weight: Intl.NumberFormat;
  private readonly signed: Intl.NumberFormat;
  private readonly plural: Intl.PluralRules;

  constructor(
    private readonly measurements: ReadonlyArray<Measurements.VO.BodyWeightMeasurement>,
    private readonly week: tools.Week,
    private readonly t: ReturnType<typeof bg.TranslatorService.use>,
    language: (typeof SupportedLanguages)[number],
  ) {
    const locale = locales[language];

    this.weight = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    this.signed = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: "always",
    });
    this.plural = new Intl.PluralRules(locale);
  }

  stat(): WeeklySummaryStat | undefined {
    const current = Measurements.Services.BodyWeightAverage.forWeek(this.measurements, this.week).calculate();

    if (!current) return undefined;

    const previous = Measurements.Services.BodyWeightAverage.forWeek(
      this.measurements,
      this.week.previous(),
    ).calculate();

    return {
      heading: this.t("notifications.weekly_summary.body_weight.header"),
      value: this.t("notifications.weekly_summary.body_weight.value", {
        value: this.weight.format(tools.Weight.fromGrams(current.average).toKilograms()),
      }),
      caption: this.t("notifications.weekly_summary.body_weight.caption", {
        count: current.count,
        noun: this.t(`notifications.weekly_summary.measurements.${this.plural.select(current.count)}`),
      }),
      note: this.note(current.average, previous?.average),
    };
  }

  private note(current: number, previous?: number): string | undefined {
    if (previous === undefined) return undefined;

    const delta =
      tools.Weight.fromGrams(current).toKilograms() - tools.Weight.fromGrams(previous).toKilograms();

    if (delta === 0) return this.t("notifications.weekly_summary.body_weight.unchanged");
    return this.t("notifications.weekly_summary.delta", { value: this.signed.format(delta) });
  }
}
