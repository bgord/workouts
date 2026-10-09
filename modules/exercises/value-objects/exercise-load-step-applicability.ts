// cSpell:ignore Choosable
import { ExerciseLoadStepOptions } from "./exercise-load-step-options";
import type { ExerciseResistanceOptions } from "./exercise-resistance-options";

export class ExerciseLoadStepApplicability {
  private static readonly applicable: Record<
    ExerciseResistanceOptions,
    ReadonlyArray<ExerciseLoadStepOptions>
  > = {
    weighted: [
      ExerciseLoadStepOptions.kg_1,
      ExerciseLoadStepOptions.kg_2_5,
      ExerciseLoadStepOptions.kg_5,
      ExerciseLoadStepOptions.kg_10,
      ExerciseLoadStepOptions.dumbbell_rack,
    ],
    bodyweight: [ExerciseLoadStepOptions.none],
  };

  private static readonly defaults: Record<ExerciseResistanceOptions, ExerciseLoadStepOptions> = {
    weighted: ExerciseLoadStepOptions.kg_2_5,
    bodyweight: ExerciseLoadStepOptions.none,
  };

  static options(resistance: ExerciseResistanceOptions): ReadonlyArray<ExerciseLoadStepOptions> {
    return ExerciseLoadStepApplicability.applicable[resistance];
  }

  static isApplicable(resistance: ExerciseResistanceOptions, loadStep: ExerciseLoadStepOptions): boolean {
    return ExerciseLoadStepApplicability.applicable[resistance].includes(loadStep);
  }

  static isChoosable(resistance: ExerciseResistanceOptions): boolean {
    return ExerciseLoadStepApplicability.applicable[resistance].length > 1;
  }

  static keep(
    resistance: ExerciseResistanceOptions,
    current: ExerciseLoadStepOptions | undefined,
  ): ExerciseLoadStepOptions {
    return current !== undefined && ExerciseLoadStepApplicability.isApplicable(resistance, current)
      ? current
      : ExerciseLoadStepApplicability.defaults[resistance];
  }
}
