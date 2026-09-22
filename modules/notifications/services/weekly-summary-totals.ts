import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { SupportedLanguages } from "+supported-languages";
import type * as Workouts from "+workouts";
import { locales } from "./weekly-summary-locales";

type LanguagesType = (typeof SupportedLanguages)[number];
type Translate = ReturnType<typeof bg.TranslatorService.use>;
type CompletedWorkouts = ReadonlyArray<Workouts.Queries.WeekCompletedWorkout>;

export type WeeklySummaryTile = { value: string; label: string; delta: string };

export class WeeklySummaryTotals {
  private readonly number: Intl.NumberFormat;
  private readonly signed: Intl.NumberFormat;
  private readonly plural: Intl.PluralRules;

  constructor(
    private readonly workouts: CompletedWorkouts,
    private readonly previousWorkouts: CompletedWorkouts,
    private readonly t: Translate,
    language: LanguagesType,
  ) {
    const locale = locales[language];

    this.number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: "always" });
    this.signed = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      useGrouping: "always",
      signDisplay: "always",
    });
    this.plural = new Intl.PluralRules(locale);
  }

  tiles(): Array<WeeklySummaryTile> {
    return [this.workoutsTile(), this.setsTile(), this.volumeTile()];
  }

  private workoutsTile(): WeeklySummaryTile {
    const current = this.workouts.length;
    const previous = this.previousWorkouts.length;

    return {
      value: this.number.format(current),
      label: this.t(`notifications.weekly_summary.workouts.${this.plural.select(current)}`),
      delta: this.delta(current - previous),
    };
  }

  private setsTile(): WeeklySummaryTile {
    const current = this.sets(this.workouts).length;
    const previous = this.sets(this.previousWorkouts).length;

    return {
      value: this.number.format(current),
      label: this.t("notifications.weekly_summary.sets.label"),
      delta: this.delta(current - previous),
    };
  }

  private volumeTile(): WeeklySummaryTile {
    const current = this.volume(this.workouts).toKilograms();
    const previous = this.volume(this.previousWorkouts).toKilograms();

    return {
      value: this.number.format(current),
      label: this.t("notifications.weekly_summary.volume.label"),
      delta: this.delta(current - previous),
    };
  }

  private sets(workouts: CompletedWorkouts) {
    return workouts.flatMap((workout) => workout.sets);
  }

  private volume(workouts: CompletedWorkouts): tools.Weight {
    return this.sets(workouts).reduce(
      (total, set) => total.add(tools.Weight.fromGrams(set.reps * set.load)),
      tools.Weight.zero(),
    );
  }

  private delta(value: number) {
    return this.t("notifications.weekly_summary.delta", { value: this.signed.format(value) });
  }
}
