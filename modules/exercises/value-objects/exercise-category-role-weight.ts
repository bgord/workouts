import { ExerciseCategoryRoleOptions } from "./exercise-category-role-options";

export class ExerciseCategoryRoleWeight {
  private static readonly weights: Record<ExerciseCategoryRoleOptions, number> = {
    [ExerciseCategoryRoleOptions.primary]: 1,
    [ExerciseCategoryRoleOptions.secondary]: 0.5,
  };

  static of(role: ExerciseCategoryRoleOptions): number {
    return ExerciseCategoryRoleWeight.weights[role];
  }

  static total(sets: Record<ExerciseCategoryRoleOptions, number>): number {
    return Object.values(ExerciseCategoryRoleOptions).reduce(
      (total, role) => total + sets[role] * ExerciseCategoryRoleWeight.of(role),
      0,
    );
  }
}
