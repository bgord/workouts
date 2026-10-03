import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { PROGRESSION_METHOD_LOAD_STEP } from "./progression-method-load-step";

export class ProgressionMethodDoubleProgressionStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly prescription: VO.ExercisePrescriptionType,
    private readonly last: VO.ExerciseTargetType,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    return { last: this.last, regress: this.regress(this.last), progress: this.progress(this.last) };
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
