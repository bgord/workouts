import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { db } from "+infra/db";

class ListExercisesWithCategoriesQueryDrizzle implements Exercises.Queries.ListExercisesWithCategories {
  async execute(requesterId: Auth.VO.UserIdType): Promise<Exercises.Queries.ExerciseListResponse> {
    const exercises = await db.query.exercises.findMany({
      columns: { id: true, name: true, description: true, image: true, imageEtag: true },
      orderBy: (exercise, { asc }) => asc(exercise.name),
      with: {
        categoryAssignments: {
          columns: {},
          orderBy: (assignment, { asc }) => asc(assignment.createdAt),
          with: { category: { columns: { id: true, name: true } } },
        },
      },
    });

    const data = exercises.map(({ categoryAssignments, ...exercise }) => ({
      ...exercise,
      categories: categoryAssignments.map((assignment) => assignment.category),
    }));

    const managed = Exercises.Invariants.CatalogIsManagedByAdmin.passes({ requesterId });

    return { data, actions: { add: { available: managed, enabled: managed, hints: [] } } };
  }
}

export const ListExercisesWithCategoriesQuery = new ListExercisesWithCategoriesQueryDrizzle();
