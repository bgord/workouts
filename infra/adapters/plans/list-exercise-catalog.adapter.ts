import { asc } from "drizzle-orm";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseCatalogQueryDrizzle implements Plans.Queries.ListExerciseCatalog {
  async execute(): Promise<Plans.Queries.ExerciseCatalogResponse> {
    const exercises = await db.query.exercises.findMany({
      columns: { id: true, name: true, description: true, resistance: true, image: true, imageEtag: true },
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
      progressionMethods: Plans.VO.ProgressionMethodApplicability[exercise.resistance],
    }));

    return { data };
  }
}

export const ListExerciseCatalogQuery = new ListExerciseCatalogQueryDrizzle();
