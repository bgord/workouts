import type * as Auth from "+auth";
import type { ExerciseCategoryIdType } from "./exercise-category-id";
import type { ExerciseCategoryNameType } from "./exercise-category-name";

export type ExerciseCategory = {
  id: ExerciseCategoryIdType;
  name: ExerciseCategoryNameType;
  userId: Auth.VO.UserIdType;
};
