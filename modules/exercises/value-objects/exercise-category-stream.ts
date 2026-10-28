import * as bg from "@bgord/bun";
import * as v from "valibot";
import type { ExerciseCategoryIdType } from "./exercise-category-id";

export const ExerciseCategoryStream = {
  of: (id: ExerciseCategoryIdType) => v.parse(bg.EventStream, `exercise_category_${id}`),
};
