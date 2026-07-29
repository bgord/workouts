import {
  ExerciseCategoryNameMax,
  ExerciseCategoryNameMin,
} from "../../modules/exercises/value-objects/exercise-category-name.validation";

export const Form = {
  name: { pattern: { min: ExerciseCategoryNameMin, max: ExerciseCategoryNameMax }, field: { name: "name" } },
};
