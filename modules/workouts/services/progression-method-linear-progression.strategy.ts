import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { PROGRESSION_METHOD_LOAD_STEP } from "./progression-method-load-step";

export class ProgressionMethodLinearProgressionStrategy implements ProgressionMethodStrategy {
  constructor(private readonly last: VO.ExerciseTargetType) {}

  calculate(): VO.ExerciseTargetProgression {
    return { last: this.last, regress: this.regress(this.last), progress: this.progress(this.last) };
  }

  private regress(last: VO.ExerciseTargetType): VO.ExerciseTargetType | undefined {
    if (last.load < PROGRESSION_METHOD_LOAD_STEP) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, load: last.load - PROGRESSION_METHOD_LOAD_STEP });
  }

  private progress(last: VO.ExerciseTargetType): VO.ExerciseTargetType {
    return v.parse(VO.ExerciseTarget, { ...last, load: last.load + PROGRESSION_METHOD_LOAD_STEP });
  }
}
