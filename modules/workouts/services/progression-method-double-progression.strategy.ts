import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { PROGRESSION_METHOD_LOAD_STEP } from "./progression-method-load-step";

export class ProgressionMethodDoubleProgressionStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly prescription: VO.ExercisePrescriptionType,
    private readonly previous: Pick<Queries.ExercisePerformance, "sets">,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const last = new ExercisePerformanceWeakestSet(this.previous).calculate();

    return { last, regress: this.regress(last), progress: this.progress(last) };
  }

  private regress(last: VO.ExerciseTargetType): VO.ExerciseTargetType | undefined {
    const { min, max } = this.prescription.reps;

    if (last.reps === min) {
      if (last.load < PROGRESSION_METHOD_LOAD_STEP) return undefined;
      return v.parse(VO.ExerciseTarget, {
        ...last,
        reps: max,
        load: last.load - PROGRESSION_METHOD_LOAD_STEP,
      });
    }

    if (last.reps === 1) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps - 1 });
  }

  private progress(last: VO.ExerciseTargetType): VO.ExerciseTargetType | undefined {
    const { min, max } = this.prescription.reps;

    if (last.reps >= max) {
      return v.parse(VO.ExerciseTarget, {
        ...last,
        reps: min,
        load: last.load + PROGRESSION_METHOD_LOAD_STEP,
      });
    }

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps + 1 });
  }
}
