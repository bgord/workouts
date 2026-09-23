import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { PROGRESSION_METHOD_LOAD_STEP } from "./progression-method-load-step";

export class ProgressionMethodLinearProgressionStrategy implements ProgressionMethodStrategy {
  constructor(private readonly previous: Pick<Queries.ExercisePerformance, "sets">) {}

  calculate(): VO.ExerciseTargetProgression {
    const last = new ExercisePerformanceWeakestSet(this.previous).calculate();

    return { last, regress: this.regress(last), progress: this.progress(last) };
  }

  private regress(last: VO.ExerciseTargetType): VO.ExerciseTargetType | undefined {
    if (last.load < PROGRESSION_METHOD_LOAD_STEP) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, load: last.load - PROGRESSION_METHOD_LOAD_STEP });
  }

  private progress(last: VO.ExerciseTargetType): VO.ExerciseTargetType {
    return v.parse(VO.ExerciseTarget, { ...last, load: last.load + PROGRESSION_METHOD_LOAD_STEP });
  }
}
