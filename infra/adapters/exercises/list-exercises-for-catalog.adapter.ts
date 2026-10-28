import { asc } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesForCatalogQueryDrizzle implements Exercises.Queries.ListExercisesForCatalog {
  async execute(): Promise<ReadonlyArray<Exercises.VO.ExerciseWithCategories>> {
    const exercises = await db.query.exercises.findMany({
      columns: {
        id: true,
        name: true,
        description: true,
        resistance: true,
        laterality: true,
        loadStep: true,
        image: true,
        imageEtag: true,
      },
      orderBy: asc(Schema.exercises.name),
      with: {
        categoryAssignments: {
          columns: { role: true },
          orderBy: [
            asc(Schema.exerciseCategoryAssignments.role),
            asc(Schema.exerciseCategoryAssignments.createdAt),
          ],
          with: { category: { columns: { id: true, name: true } } },
        },
      },
    });

    return exercises.map(({ categoryAssignments, ...exercise }) => ({
      ...exercise,
      categories: categoryAssignments.map((assignment) => ({
        ...assignment.category,
        role: assignment.role,
      })),
    }));
  }
}

export const ListExercisesForCatalogQuery = new ListExercisesForCatalogQueryDrizzle();
