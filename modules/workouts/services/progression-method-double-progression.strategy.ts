import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = {
  prescription: VO.ExercisePrescriptionType;
  last: VO.ExerciseTargetType;
  effort?: VO.RirType;
};

type Dependencies = { LoadStep: LoadStepStrategy };

export class ProgressionMethodDoubleProgressionStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    if (this.belowTarget()) {
      return {
        last: this.config.last,
        regress: this.regress(),
        hold: VO.ProgressionHoldReasonOptions.rir_below_target,
      };
    }

    return { last: this.config.last, regress: this.regress(), progress: this.progress() };
  }

  private belowTarget(): boolean {
    const { prescription, effort } = this.config;

    if (prescription.rir === undefined || effort === undefined) return false;

    return effort < prescription.rir;
  }

  private regress(): VO.ExerciseTargetType | undefined {
    const { last } = this.config;
    const { min, max } = this.config.prescription.reps;

    if (last.reps === min) {
      const load = this.deps.LoadStep.decrease(last.load);

      if (load === undefined) return undefined;
      return v.parse(VO.ExerciseTarget, { ...last, reps: max, load });
    }

    if (last.reps === 1) return undefined;

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps - 1 });
  }

  private progress(): VO.ExerciseTargetType | undefined {
    const { last } = this.config;
    const { min, max } = this.config.prescription.reps;

    if (max !== undefined && last.reps >= max) {
      const load = this.deps.LoadStep.increase(last.load);

      if (load === undefined) return undefined;
      return v.parse(VO.ExerciseTarget, { ...last, reps: min, load });
    }

    return v.parse(VO.ExerciseTarget, { ...last, reps: last.reps + 1 });
  }
}
