import { asc } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesWithCategoriesQueryDrizzle implements Exercises.Queries.ListExercisesWithCategories {
  async execute(requesterId: Auth.VO.UserIdType): Promise<Exercises.Queries.ExerciseListResponse> {
    const exercises = await db.query.exercises.findMany({
      columns: { id: true, name: true, description: true, image: true, imageEtag: true },
      orderBy: asc(Schema.exercises.name),
      with: {
        categoryAssignments: {
          columns: {},
          orderBy: asc(Schema.exerciseCategoryAssignments.createdAt),
          with: { category: { columns: { id: true, name: true } } },
        },
      },
    });

    const data = exercises.map(({ categoryAssignments, ...exercise }) => ({
      ...exercise,
      categories: categoryAssignments.map((assignment) => assignment.category),
    }));

    return { data, actions: new Exercises.Services.ExerciseListActions({ requesterId }).calculate() };
  }
}

export const ListExercisesWithCategoriesQuery = new ListExercisesWithCategoriesQueryDrizzle();
