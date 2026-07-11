// cspell:ignore ilike
import type * as tools from "@bgord/tools";
import { desc, ilike } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
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
      id: v.parse(Exercises.VO.ExerciseCategoryId, exerciseCategory?.id),
      name: v.parse(Exercises.VO.ExerciseCategoryName, exerciseCategory?.name),
    }));
  }
}

export const SearchExerciseCategoriesQuery = new SearchExerciseCategoriesQueryDrizzle();
