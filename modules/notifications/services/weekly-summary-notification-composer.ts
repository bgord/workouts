import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import type { SupportedLanguages } from "+supported-languages";
import type * as VO from "+notifications/value-objects";
import { WeeklySummaryFormatter } from "./weekly-summary-formatter";
import type {
  WeeklySummaryNotification,
  WeeklySummaryNotificationContent,
} from "./weekly-summary-notification";

type LanguagesType = (typeof SupportedLanguages)[number];
type Translate = ReturnType<typeof bg.TranslatorService.use>;
type NounForms = { singular: string; plural: string; genitive: string };

const BODY_WEIGHT_UNCHANGED_THRESHOLD_GRAMS = 50;

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
        numbers: this.numbers(summary.numbers),
        highlights: this.highlights(summary.highlights),
        bodyWeight: this.bodyWeight(summary.bodyWeight),
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

  private numbers(numbers: VO.WeeklySummary["numbers"]): WeeklySummaryNotificationContent["numbers"] {
    const { current, delta } = numbers;

    if (current.workouts === 0) return { empty: this.t("notifications.weekly_summary.empty") };

    return {
      tiles: [
        {
          value: this.format.integer(current.workouts),
          label: this.format.noun(current.workouts, this.forms("workouts")),
          delta: this.delta(this.format.signed(delta.workouts)),
        },
        {
          value: this.format.integer(current.sets),
          label: this.t("notifications.weekly_summary.sets.label"),
          delta: this.delta(this.format.signed(delta.sets)),
        },
        {
          value: this.format.kilograms(current.volume),
          label: this.t("notifications.weekly_summary.volume.label"),
          delta: this.delta(`${this.format.signedKilograms(delta.volume)} kg`),
        },
      ],
    };
  }

  private highlights(
    highlights: VO.WeeklySummary["highlights"],
  ): WeeklySummaryNotificationContent["highlights"] {
    return {
      heading: this.t("notifications.weekly_summary.highlights.header"),
      rows: highlights.map((highlight) => ({
        name: highlight.exerciseName,
        previous: this.set(highlight.previous),
        current: this.set(highlight.current),
      })),
    };
  }

  private bodyWeight(
    bodyWeight: VO.WeeklySummary["bodyWeight"],
  ): WeeklySummaryNotificationContent["bodyWeight"] {
    if (!bodyWeight) return undefined;

    return {
      heading: this.t("notifications.weekly_summary.body_weight.header"),
      value: this.t("notifications.weekly_summary.body_weight.value", {
        value: this.format.weight(bodyWeight.average),
      }),
      caption: this.t("notifications.weekly_summary.body_weight.caption", {
        count: bodyWeight.count,
        noun: this.format.noun(bodyWeight.count, this.forms("measurements")),
      }),
      note: this.bodyWeightNote(bodyWeight),
    };
  }

  private bodyWeightNote(bodyWeight: VO.WeeklySummaryBodyWeight): string | undefined {
    if (bodyWeight.previousAverage === undefined) return undefined;

    const difference = bodyWeight.average - bodyWeight.previousAverage;

    if (Math.abs(difference) < BODY_WEIGHT_UNCHANGED_THRESHOLD_GRAMS) {
      return this.t("notifications.weekly_summary.body_weight.unchanged");
    }

    const delta = this.delta(`${this.format.signedWeight(difference)} kg`);

    if (!bodyWeight.goal || bodyWeight.goal === Measurements.VO.BodyWeightGoalOptions.maintain) return delta;

    const direction = difference > 0 ? "up" : "down";

    return this.t("notifications.weekly_summary.body_weight.note", {
      delta,
      goal: this.t(`notifications.weekly_summary.body_weight.goal.${bodyWeight.goal}.${direction}`),
    });
  }

  private set(target: VO.WeeklySummaryHighlight["current"]) {
    return this.t("notifications.weekly_summary.highlights.set", {
      sets: target.sets,
      reps: target.reps,
      load: this.format.load(target.load),
    });
  }

  private delta(value: string) {
    return this.t("notifications.weekly_summary.delta", { value });
  }

  private forms(noun: "workouts" | "measurements" | "completed"): NounForms {
    return {
      singular: this.t(`notifications.weekly_summary.${noun}.noun.singular`),
      plural: this.t(`notifications.weekly_summary.${noun}.noun.plural`),
      genitive: this.t(`notifications.weekly_summary.${noun}.noun.genitive`),
    };
  }
}
