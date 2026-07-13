import { desc, eq } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
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
      id: v.parse(Exercises.VO.ExerciseCategoryId, row.exercise_categories?.id),
      name: v.parse(Exercises.VO.ExerciseCategoryName, row.exercise_categories?.name),
    }));
  }
}

export const ListCategoriesAssignedToExerciseQuery = new ListCategoriesAssignedToExerciseQueryDrizzle();
