import type * as tools from "@bgord/tools";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { ExerciseSignalWindow } from "./exercise-signal-window";
import type { ProgressionSignalStrategy } from "./progression-signal.strategy";

type Config = {
  scheduledFor: tools.DayIsoIdType;
  performances: ReadonlyArray<Queries.ExerciseRecentPerformance>;
};

export class ProgressionSignalSkipStrategy implements ProgressionSignalStrategy {
  readonly blocksProgress = false;

  constructor(private readonly config: Config) {}

  calculate(): VO.ProgressionSignalOptions | undefined {
    const window = new ExerciseSignalWindow(this.config).sessions();

    if (!window) return undefined;
    if (!window.every((performance) => performance.sets.length === 0)) return undefined;

    return VO.ProgressionSignalOptions.skip;
  }
}
