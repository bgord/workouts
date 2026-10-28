import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";

type Config = {
  scheduledFor: tools.DayIsoIdType;
  performances: ReadonlyArray<Queries.ExerciseRecentPerformance>;
};

export class ExerciseSignalWindow {
  constructor(private readonly config: Config) {}

  sessions(): ReadonlyArray<Queries.ExerciseRecentPerformance> | undefined {
    const window = this.config.performances.slice(0, VO.ExerciseSignalWindowSessions);
    const days = [this.config.scheduledFor, ...window.map((performance) => performance.scheduledFor)];

    if (window.length < VO.ExerciseSignalWindowSessions) return undefined;
    if (window.some((_, index) => this.isBreak(days[index]!, days[index + 1]!))) return undefined;

    return window;
  }

  private isBreak(newer: tools.DayIsoIdType, older: tools.DayIsoIdType): boolean {
    const earliest = tools.Day.fromIsoId(newer).shift(v.parse(tools.Integer, -VO.ExerciseSignalBreakDays));

    return older <= earliest.toIsoId();
  }
}
