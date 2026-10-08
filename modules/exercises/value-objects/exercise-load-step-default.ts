import { ExerciseLoadStepOptions } from "./exercise-load-step-options";
import type { ExerciseResistanceOptions } from "./exercise-resistance-options";

export const ExerciseLoadStepDefault: Record<ExerciseResistanceOptions, ExerciseLoadStepOptions> = {
  weighted: ExerciseLoadStepOptions.kg_2_5,
  bodyweight: ExerciseLoadStepOptions.none,
};
