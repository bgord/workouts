// cspell:ignore ilike
import type * as tools from "@bgord/tools";
import { desc, ilike } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class SearchExerciseCategoriesQueryDrizzle implements Exercises.Queries.SearchExerciseCategories {
  async execute(
    name: Exercises.VO.ExerciseCategoryNameType,
    limit: tools.IntegerPositiveType,
  ): Promise<ReadonlyArray<Exercises.VO.ExerciseCategory>> {
    const exerciseCategories = await db
      .select()
      .from(Schema.exerciseCategories)
      .where(ilike(Schema.exerciseCategories.name, name))
      .orderBy(desc(Schema.exerciseCategories.updatedAt))
      .limit(limit);

    return exerciseCategories.map((exerciseCategory) => ({
      id: exerciseCategory.id,
      name: exerciseCategory.name,
      userId: exerciseCategory.userId,
    }));
  }
}

export const SearchExerciseCategoriesQuery = new SearchExerciseCategoriesQueryDrizzle();
