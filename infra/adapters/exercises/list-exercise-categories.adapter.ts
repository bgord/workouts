import { desc } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseCategoriesQueryDrizzle implements Exercises.Queries.ListExerciseCategories {
  async execute(): Promise<ReadonlyArray<Exercises.VO.ExerciseCategory>> {
    const exerciseCategories = await db
      .select()
      .from(Schema.exerciseCategories)
      .orderBy(desc(Schema.exerciseCategories.updatedAt));

    return exerciseCategories.map((exerciseCategory) => ({
      id: v.parse(Exercises.VO.ExerciseCategoryId, exerciseCategory?.id),
      name: v.parse(Exercises.VO.ExerciseCategoryName, exerciseCategory?.name),
    }));
  }
}

export const ListExerciseCategoriesQuery = new ListExerciseCategoriesQueryDrizzle();
