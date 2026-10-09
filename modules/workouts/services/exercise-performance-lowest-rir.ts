// cSpell:ignore rirs
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";

export class ExercisePerformanceLowestRir {
  constructor(private readonly performance: Pick<Queries.ExercisePerformance, "sets">) {}

  calculate(): VO.RirType | undefined {
    const rirs = this.performance.sets.flatMap((set) => (set.rir === null ? [] : [set.rir]));

    if (rirs.length === 0) return undefined;

    return v.parse(VO.Rir, Math.min(...rirs));
  }
}
