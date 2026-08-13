import { desc, eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesAssignedToCategoryQueryDrizzle
  implements Exercises.Queries.ListExercisesAssignedToCategory
{
  async execute(
    exerciseCategoryId: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    const result = await db
      .select()
      .from(Schema.exercises)
      .innerJoin(
        Schema.exerciseCategoryAssignments,
        eq(Schema.exercises.id, Schema.exerciseCategoryAssignments.exerciseId),
      )
      .where(eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, exerciseCategoryId))
      .orderBy(desc(Schema.exercises.updatedAt));

    return result.map((row) => ({
      id: row.exercises.id,
      name: row.exercises.name,
      description: row.exercises.description,
      image: row.exercises.image,
    }));
  }
}

export const ListExercisesAssignedToCategoryQuery = new ListExercisesAssignedToCategoryQueryDrizzle();
