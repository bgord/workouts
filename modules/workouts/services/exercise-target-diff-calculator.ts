import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";

export class ExerciseTargetDiffCalculator {
  constructor(
    private readonly target: VO.ExerciseTargetType,
    private readonly previous: Queries.ExercisePerformance,
  ) {}

  calculate(): VO.ExerciseTargetDiff {
    const reps = Math.min(...this.previous.sets.map((set) => set.reps));
    const load = Math.min(...this.previous.sets.map((set) => set.load));

    return {
      sets: v.parse(tools.Integer, this.target.sets - this.previous.sets.length),
      reps: v.parse(tools.Integer, this.target.reps - reps),
      load: v.parse(tools.Integer, this.target.load - load),
    };
  }
}
