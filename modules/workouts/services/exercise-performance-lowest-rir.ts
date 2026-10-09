// cSpell:ignore rirs
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";

export class ExercisePerformanceLowestRir {
  constructor(private readonly performance: Pick<Queries.ExercisePerformance, "sets">) {}

  calculate(): VO.RirType | undefined {
    const { sets } = this.performance;
    const rirs = sets.flatMap((set) => (set.rir === null ? [] : [set.rir]));

    if (rirs.length === 0 || rirs.length !== sets.length) return undefined;

    return v.parse(VO.Rir, Math.min(...rirs));
  }
}
