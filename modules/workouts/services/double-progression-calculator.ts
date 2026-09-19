import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";

const LOAD_STEP = tools.Weight.fromKilograms(2.5).get();

export class DoubleProgressionCalculator {
  constructor(
    private readonly prescription: VO.ExercisePrescriptionType,
    private readonly previous: Queries.ExercisePerformance,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const last = new ExercisePerformanceWeakestSet(this.previous).calculate();

    return { last, regress: this.regress(last), progress: this.progress(last) };
  }

  private regress(last: VO.ExerciseTargetType): VO.ExerciseTargetType | undefined {
    const { min, max } = this.prescription.reps;

    if (last.reps === min) {
      if (last.load < LOAD_STEP) return undefined;
      return v.parse(VO.ExerciseTarget, { ...last, reps: max, load: last.load - LOAD_STEP });
    }

    if (last.reps === 1) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps - 1 });
  }

  private progress(last: VO.ExerciseTargetType): VO.ExerciseTargetType | undefined {
    const { min, max } = this.prescription.reps;

    if (last.reps >= max) {
      return v.parse(VO.ExerciseTarget, { ...last, reps: min, load: last.load + LOAD_STEP });
    }

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps + 1 });
  }
}
