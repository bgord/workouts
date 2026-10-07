import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; last: VO.ExerciseTargetType };

export class ProgressionMethodRepProgressionStrategy implements ProgressionMethodStrategy {
  constructor(private readonly config: Config) {}

  calculate(): VO.ExerciseTargetProgression {
    return { last: this.config.last, regress: this.regress(), progress: this.progress() };
  }

  private regress(): VO.ExerciseTargetType | undefined {
    const { last } = this.config;

    if (last.reps === 1) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps - 1 });
  }

  private progress(): VO.ExerciseTargetType | undefined {
    const { last } = this.config;
    const { max } = this.config.prescription.reps;

    if (max !== undefined && last.reps >= max) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps + 1 });
  }
}
