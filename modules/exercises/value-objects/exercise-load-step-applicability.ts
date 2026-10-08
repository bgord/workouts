import { ExerciseLoadStepOptions } from "./exercise-load-step-options";
import type { ExerciseResistanceOptions } from "./exercise-resistance-options";

export const ExerciseLoadStepApplicability: Record<
  ExerciseResistanceOptions,
  readonly [ExerciseLoadStepOptions, ...ReadonlyArray<ExerciseLoadStepOptions>]
> = {
  weighted: [
    ExerciseLoadStepOptions.kg_2_5,
    ExerciseLoadStepOptions.kg_1,
    ExerciseLoadStepOptions.kg_5,
    ExerciseLoadStepOptions.kg_10,
    ExerciseLoadStepOptions.dumbbell_rack,
  ],
  bodyweight: [ExerciseLoadStepOptions.none],
};
