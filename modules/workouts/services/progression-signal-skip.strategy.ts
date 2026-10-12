import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";

type Config = {
  scheduledFor: tools.DayIsoIdType;
  performances: ReadonlyArray<Queries.ExerciseRecentPerformance>;
};

export class ProgressionSignalSkipStrategy implements ProgressionSignalStrategy {
  readonly blocksProgress = false;

  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionSignalOptions | undefined {
    const window = this.config.performances.slice(0, VO.ExerciseSignalWindowSessions);
    const days = [this.config.scheduledFor, ...window.map((performance) => performance.scheduledFor)];

    if (window.length < VO.ExerciseSignalWindowSessions) return undefined;
    if (window.some((_, index) => this.isBreak(days[index]!, days[index + 1]!))) return undefined;
    if (!window.every((performance) => performance.sets.length === 0)) return undefined;

    return VO.ProgressionSignalOptions.skip;
  }

  private isBreak(newer: tools.DayIsoIdType, older: tools.DayIsoIdType): boolean {
    const earliest = tools.Day.fromIsoId(newer).shift(v.parse(tools.Integer, -VO.ExerciseSignalBreakDays));

    return older <= earliest.toIsoId();
  }
}
