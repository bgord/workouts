import { desc } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseCategoriesQueryDrizzle implements Exercises.Queries.ListExerciseCategories {
  async execute(): Promise<ReadonlyArray<Exercises.VO.ExerciseCategory>> {
    const exerciseCategories = await db
      .select()
      .from(Schema.exerciseCategories)
      .orderBy(desc(Schema.exerciseCategories.updatedAt));

    return exerciseCategories.map((exerciseCategory) => ({
      id: exerciseCategory.id,
      name: exerciseCategory.name,
      userId: exerciseCategory.userId,
    }));
  }
}

export const ListExerciseCategoriesQuery = new ListExerciseCategoriesQueryDrizzle();
