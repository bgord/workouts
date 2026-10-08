import { ExerciseLoadStepApplicability } from "../../modules/exercises/value-objects/exercise-load-step-applicability";
import { ExerciseLoadStepDefault } from "../../modules/exercises/value-objects/exercise-load-step-default";
import type { ExerciseLoadStepOptions } from "../../modules/exercises/value-objects/exercise-load-step-options";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";

export const ExerciseLoadStepChoice = {
  options: (resistance: ExerciseResistanceOptions) => ExerciseLoadStepApplicability[resistance],
  keep: (resistance: ExerciseResistanceOptions, current: ExerciseLoadStepOptions | undefined) =>
    ExerciseLoadStepApplicability[resistance].find((option) => option === current) ??
    ExerciseLoadStepDefault[resistance],
};
