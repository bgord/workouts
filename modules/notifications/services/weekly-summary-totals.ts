import type * as bg from "@bgord/bun";
import type { SupportedLanguages } from "+supported-languages";
import * as Workouts from "+workouts";
import { locales } from "./weekly-summary-locales";

type LanguagesType = (typeof SupportedLanguages)[number];
type Translate = ReturnType<typeof bg.TranslatorService.use>;
type CompletedWorkouts = ReadonlyArray<Workouts.Queries.WeekCompletedWorkout>;
type LoggedSets = Workouts.Queries.WeekCompletedWorkout["loggedSets"];

export type WeeklySummaryTile = { value: string; label: string; delta: string };

export class WeeklySummaryTotals {
  private readonly number: Intl.NumberFormat;
  private readonly signed: Intl.NumberFormat;
  private readonly plural: Intl.PluralRules;
  private readonly sets: LoggedSets;
  private readonly previousSets: LoggedSets;

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

    this.sets = workouts.flatMap((workout) => workout.loggedSets);
    this.previousSets = previousWorkouts.flatMap((workout) => workout.loggedSets);
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
      delta: this.t("notifications.weekly_summary.delta", {
        value: this.signed.format(current - previous),
      }),
    };
  }

  private setsTile(): WeeklySummaryTile {
    const current = this.sets.length;
    const previous = this.previousSets.length;

    return {
      value: this.number.format(current),
      label: this.t("notifications.weekly_summary.sets.label"),
      delta: this.t("notifications.weekly_summary.delta", {
        value: this.signed.format(current - previous),
      }),
    };
  }

  private volumeTile(): WeeklySummaryTile {
    const current = new Workouts.Services.LoggedSetsVolume(this.sets).calculate().toKilograms();
    const previous = new Workouts.Services.LoggedSetsVolume(this.previousSets).calculate().toKilograms();

    return {
      value: this.number.format(current),
      label: this.t("notifications.weekly_summary.volume.label"),
      delta: this.t("notifications.weekly_summary.delta", {
        value: this.signed.format(current - previous),
      }),
    };
  }
}
