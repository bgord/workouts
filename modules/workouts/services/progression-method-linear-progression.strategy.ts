import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = { prescription: VO.ExercisePrescriptionType; last: VO.ExerciseTargetType };

type Dependencies = { LoadStep: LoadStepStrategy };

export class ProgressionMethodLinearProgressionStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    const { prescription, last } = this.config;
    const regress = this.regress();
    const progress = this.progress();

    if (progress === undefined) return { last, regress };
    if (last.reps < prescription.reps.min) {
      return { last, regress, hold: VO.ProgressionHoldReasonOptions.reps_below_target };
    }

    return { last, regress, progress };
  }

  private regress(): VO.ExerciseTargetType | undefined {
    const load = this.deps.LoadStep.decrease(this.config.last.load);

    if (load === undefined) return undefined;

    return v.parse(VO.ExerciseTarget, { ...this.config.last, load });
  }

  private progress(): VO.ExerciseTargetType | undefined {
    const load = this.deps.LoadStep.increase(this.config.last.load);

    if (load === undefined) return undefined;

    return v.parse(VO.ExerciseTarget, { ...this.config.last, load });
  }
}
