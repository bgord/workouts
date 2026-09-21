import { asc, eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListCategoriesAssignedToExerciseQueryDrizzle
  implements Exercises.Queries.ListCategoriesAssignedToExercise
{
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<ReadonlyArray<Exercises.VO.ExerciseCategory>> {
    return db
      .select({ id: Schema.exerciseCategories.id, name: Schema.exerciseCategories.name })
      .from(Schema.exerciseCategories)
      .innerJoin(
        Schema.exerciseCategoryAssignments,
        eq(Schema.exerciseCategories.id, Schema.exerciseCategoryAssignments.exerciseCategoryId),
      )
      .where(eq(Schema.exerciseCategoryAssignments.exerciseId, exerciseId))
      .orderBy(asc(Schema.exerciseCategoryAssignments.createdAt));
  }
}

export const ListCategoriesAssignedToExerciseQuery = new ListCategoriesAssignedToExerciseQueryDrizzle();
