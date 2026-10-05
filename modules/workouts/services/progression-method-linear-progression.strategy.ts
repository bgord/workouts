import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";

type Config = { last: VO.ExerciseTargetType };

type Dependencies = { LoadStep: LoadStepStrategy };

export class ProgressionMethodLinearProgressionStrategy implements ProgressionMethodStrategy {
  constructor(
    private readonly config: Config,
    private readonly deps: Dependencies,
  ) {}

  calculate(): VO.ExerciseTargetProgression {
    return { last: this.config.last, regress: this.regress(), progress: this.progress() };
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
