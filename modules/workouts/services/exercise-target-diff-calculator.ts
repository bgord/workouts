import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";

export class ExerciseTargetDiffCalculator {
  constructor(
    private readonly target: VO.ExerciseTargetType,
    private readonly previous: Pick<Queries.ExercisePerformance, "sets">,
  ) {}

  calculate(): VO.ExerciseTargetDiff {
    const weakest = new ExercisePerformanceWeakestSet(this.previous).calculate();

    return {
      sets: v.parse(tools.Integer, this.target.sets - weakest.sets),
      reps: v.parse(tools.Integer, this.target.reps - weakest.reps),
      load: v.parse(tools.Integer, this.target.load - weakest.load),
    };
  }
}
