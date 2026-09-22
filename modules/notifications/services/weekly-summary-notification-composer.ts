import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { SupportedLanguages } from "+supported-languages";
import type * as VO from "+notifications/value-objects";
import { ComparisonDirections } from "../value-objects/comparison";
import { WeeklySummarySectionKinds } from "../value-objects/weekly-summary";
import { WeeklySummaryFormatter, WeightFormats } from "./weekly-summary-formatter";
import {
  WeeklySummaryBlockKinds,
  type WeeklySummaryNotification,
  type WeeklySummaryNotificationBlock,
} from "./weekly-summary-notification";

type LanguagesType = (typeof SupportedLanguages)[number];
type Translate = ReturnType<typeof bg.TranslatorService.use>;
type NounForms = { singular: string; plural: string; genitive: string };

export class WeeklySummaryNotificationComposer {
  private readonly t: Translate;
  private readonly format: WeeklySummaryFormatter;

  constructor(
    private readonly BETTER_AUTH_URL: tools.UrlWithoutSlashType,
    translations: bg.TranslationsType,
    language: LanguagesType,
  ) {
    this.t = bg.TranslatorService.use(translations);
    this.format = new WeeklySummaryFormatter(language);
  }

  compose(summary: VO.WeeklySummary): WeeklySummaryNotification {
    const range = this.format.range(tools.Week.fromIsoId(summary.weekIsoId));

    return {
      subject: v.parse(bg.MailerSubject, this.t("notifications.weekly_summary.subject", { range })),
      content: {
        eyebrow: this.t("notifications.weekly_summary.eyebrow"),
        title: range,
        blocks: summary.sections.flatMap((section) => this.blocks(section)),
        footer: {
          before: this.t("notifications.weekly_summary.footer.before"),
          link: this.t("notifications.weekly_summary.footer.link"),
          after: this.t("notifications.weekly_summary.footer.after"),
          url: `${this.BETTER_AUTH_URL}/profile`,
        },
        signature: this.t("notifications.weekly_summary.signature"),
      },
    };
  }

  private blocks(section: VO.WeeklySummarySection): Array<WeeklySummaryNotificationBlock> {
    switch (section.kind) {
      case WeeklySummarySectionKinds.numbers:
        return this.numbers(section);
      case WeeklySummarySectionKinds.highlights:
        return this.highlights(section);
      case WeeklySummarySectionKinds.bodyWeight:
        return this.bodyWeight(section);
    }
  }

  private numbers(section: VO.WeeklySummaryNumbersSection): Array<WeeklySummaryNotificationBlock> {
    if (section.workouts.current === 0) {
      return [{ kind: WeeklySummaryBlockKinds.text, text: this.t("notifications.weekly_summary.empty") }];
    }

    return [
      {
        kind: WeeklySummaryBlockKinds.tiles,
        tiles: [
          {
            value: this.format.integer(section.workouts.current),
            label: this.format.noun(section.workouts.current, this.forms("workouts")),
            delta: this.delta(this.format.signed(section.workouts.delta)),
          },
          {
            value: this.format.integer(section.sets.current),
            label: this.t("notifications.weekly_summary.sets.label"),
            delta: this.delta(this.format.signed(section.sets.delta)),
          },
          {
            value: this.format.weight(section.volume.current, WeightFormats.volume),
            label: this.t("notifications.weekly_summary.volume.label"),
            delta: this.delta(
              this.kilograms(this.format.signedWeight(section.volume.delta, WeightFormats.volume)),
            ),
          },
        ],
      },
    ];
  }

  private highlights(section: VO.WeeklySummaryHighlightsSection): Array<WeeklySummaryNotificationBlock> {
    return [
      {
        kind: WeeklySummaryBlockKinds.heading,
        text: this.t("notifications.weekly_summary.highlights.header"),
      },
      {
        kind: WeeklySummaryBlockKinds.changes,
        rows: section.rows.map((highlight) => ({
          name: highlight.exerciseName,
          previous: this.set(highlight.previous),
          current: this.set(highlight.current),
        })),
      },
    ];
  }

  private bodyWeight(section: VO.WeeklySummaryBodyWeightSection): Array<WeeklySummaryNotificationBlock> {
    return [
      {
        kind: WeeklySummaryBlockKinds.heading,
        text: this.t("notifications.weekly_summary.body_weight.header"),
      },
      {
        kind: WeeklySummaryBlockKinds.stat,
        value: this.kilograms(this.format.weight(section.average.current, WeightFormats.bodyWeight)),
        caption: this.t("notifications.weekly_summary.body_weight.caption", {
          count: section.count,
          noun: this.format.noun(section.count, this.forms("measurements")),
        }),
        note: this.bodyWeightNote(section.average),
      },
    ];
  }

  private bodyWeightNote(average: VO.Comparison): string | undefined {
    if (average.direction === ComparisonDirections.unknown) return undefined;

    if (average.direction === ComparisonDirections.flat) {
      return this.t("notifications.weekly_summary.body_weight.unchanged");
    }

    const delta = this.delta(
      this.kilograms(this.format.signedWeight(average.delta, WeightFormats.bodyWeight)),
    );

    return this.t("notifications.weekly_summary.body_weight.note", { delta });
  }

  private set(target: VO.WeeklySummaryHighlight["current"]) {
    return this.t("notifications.weekly_summary.highlights.set", {
      sets: target.sets,
      reps: target.reps,
      load: this.format.weight(target.load, WeightFormats.load),
    });
  }

  private delta(value: string) {
    return this.t("notifications.weekly_summary.delta", { value });
  }

  private kilograms(value: string) {
    return this.t("notifications.weekly_summary.kilograms", { value });
  }

  private forms(noun: "workouts" | "measurements" | "completed"): NounForms {
    return {
      singular: this.t(`notifications.weekly_summary.${noun}.noun.singular`),
      plural: this.t(`notifications.weekly_summary.${noun}.noun.plural`),
      genitive: this.t(`notifications.weekly_summary.${noun}.noun.genitive`),
    };
  }
}
