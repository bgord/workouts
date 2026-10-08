import {
  ExerciseDescriptionMax,
  ExerciseDescriptionMin,
} from "../../modules/exercises/value-objects/exercise-description.validation";
import { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import {
  ExerciseNameMax,
  ExerciseNameMin,
} from "../../modules/exercises/value-objects/exercise-name.validation";
import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";

export const Form = {
  name: { pattern: { min: ExerciseNameMin, max: ExerciseNameMax }, field: { name: "name" } },
  description: {
    pattern: { min: ExerciseDescriptionMin, max: ExerciseDescriptionMax },
    field: { name: "description" },
  },
  resistance: { field: { name: "resistance", defaultValue: ExerciseResistanceOptions.weighted } },
  laterality: { field: { name: "laterality", defaultValue: ExerciseLateralityOptions.bilateral } },
};
