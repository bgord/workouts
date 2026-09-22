import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import { GetExerciseUsageCountQuery } from "./get-exercise-usage-count.adapter";

class GetExerciseWithCategoriesQueryDrizzle implements Exercises.Queries.GetExerciseWithCategories {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    requesterId: Auth.VO.UserIdType,
  ): Promise<Exercises.Queries.ExerciseGetResponse | null> {
    const [exercise, count] = await Promise.all([
      db.query.exercises.findFirst({
        columns: { id: true, name: true, description: true, image: true, imageEtag: true },
        where: (exercise, { eq }) => eq(exercise.id, exerciseId),
        with: {
          categoryAssignments: {
            columns: {},
            orderBy: (assignment, { asc }) => asc(assignment.createdAt),
            with: { category: { columns: { id: true, name: true } } },
          },
        },
      }),
      GetExerciseUsageCountQuery.execute(exerciseId),
    ]);

    if (!exercise) return null;

    const { categoryAssignments, ...rest } = exercise;
    const categories = categoryAssignments.map((assignment) => assignment.category);

    const managed = Exercises.Invariants.CatalogIsManagedByAdmin.passes({ requesterId });
    const whenManaged = { available: managed, enabled: managed, hints: [] };

    const unused = Exercises.Invariants.ExerciseIsNotUsed.passes({ count });
    const assignable = Exercises.Invariants.ExerciseCategoryLimit.passes({ exerciseCategories: categories });

    return {
      data: { ...rest, categories },
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

export const GetExerciseWithCategoriesQuery = new GetExerciseWithCategoriesQueryDrizzle();
