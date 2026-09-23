import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";

export class ExercisePerformanceWeakestSet {
  constructor(private readonly performance: Pick<Queries.ExercisePerformance, "sets">) {}

  calculate(): VO.ExerciseTargetType {
    return v.parse(VO.ExerciseTarget, {
      sets: this.performance.sets.length,
      reps: Math.min(...this.performance.sets.map((set) => set.reps)),
      load: Math.min(...this.performance.sets.map((set) => set.load)),
    });
  }
}
