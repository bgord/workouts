import { desc, eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListCategoriesAssignedToExerciseQueryDrizzle
  implements Exercises.Queries.ListCategoriesAssignedToExercise
{
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<ReadonlyArray<Exercises.VO.ExerciseCategory>> {
    const result = await db
      .select()
      .from(Schema.exerciseCategories)
      .innerJoin(
        Schema.exerciseCategoryAssignments,
        eq(Schema.exerciseCategories.id, Schema.exerciseCategoryAssignments.exerciseCategoryId),
      )
      .where(eq(Schema.exerciseCategoryAssignments.exerciseId, exerciseId))
      .orderBy(desc(Schema.exerciseCategories.updatedAt));

    return result.map((row) => ({
      id: row.exercise_categories.id,
      name: row.exercise_categories.name,
      userId: row.exercise_categories.userId,
    }));
  }
}

export const ListCategoriesAssignedToExerciseQuery = new ListCategoriesAssignedToExerciseQueryDrizzle();
