import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { GetExerciseQuery } from "./get-exercise.adapter";
import { GetExerciseUsageCountQuery } from "./get-exercise-usage-count.adapter";
import { ListCategoriesAssignedToExerciseQuery } from "./list-categories-assigned-to-exercise.adapter";

class GetExerciseWithCategoriesQueryComposed implements Exercises.Queries.GetExerciseWithCategories {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    requesterId: Auth.VO.UserIdType,
  ): Promise<Exercises.Queries.ExerciseGetResponse | null> {
    const exercise = await GetExerciseQuery.execute(exerciseId);

    if (!exercise) return null;

    const categories = await ListCategoriesAssignedToExerciseQuery.execute(exerciseId);
    const count = await GetExerciseUsageCountQuery.execute(exerciseId);

    const managed = Exercises.Invariants.CatalogIsManagedByAdmin.passes({ requesterId });
    const whenManaged = { available: managed, enabled: managed, hints: [] };

    const unused = Exercises.Invariants.ExerciseIsNotUsed.passes({ count });
    const assignable = Exercises.Invariants.ExerciseCategoryLimit.passes({ exerciseCategories: categories });

    return {
      data: { ...exercise, categories },
      actions: {
        update: whenManaged,
        imageChange: whenManaged,
        delete: {
          available: managed,
          enabled: managed && unused,
          hints: unused ? [] : ["exercise.delete.blocked.in_use"],
        },
        categoryAssign: {
          available: managed,
          enabled: managed && assignable,
          hints: assignable ? [] : ["exercise.category.assign.blocked.limit"],
        },
        categoryUnassign: whenManaged,
      },
    };
  }
}

export const GetExerciseWithCategoriesQuery = new GetExerciseWithCategoriesQueryComposed();
