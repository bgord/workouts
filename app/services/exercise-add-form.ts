import {
  ExerciseDescriptionMax,
  ExerciseDescriptionMin,
} from "../../modules/exercises/value-objects/exercise-description.validation";
import {
  ExerciseNameMax,
  ExerciseNameMin,
} from "../../modules/exercises/value-objects/exercise-name.validation";

export const Form = {
  name: { pattern: { min: ExerciseNameMin, max: ExerciseNameMax }, field: { name: "name" } },
  description: {
    pattern: { min: ExerciseDescriptionMin, max: ExerciseDescriptionMax },
    field: { name: "description" },
  },
};
