import * as tools from "@bgord/tools";
import { ne } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseCategoryNameCountQueryDrizzle implements Exercises.Queries.GetExerciseCategoryNameCount {
  async execute(
    exerciseCategoryName: Exercises.VO.ExerciseCategoryNameType,
    excludedExerciseCategoryId?: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    const rows = await db
      .select({ name: Schema.exerciseCategories.name })
      .from(Schema.exerciseCategories)
      .where(
        excludedExerciseCategoryId ? ne(Schema.exerciseCategories.id, excludedExerciseCategoryId) : undefined,
      );

    const name = exerciseCategoryName.toLowerCase();

    return tools.Int.nonNegative(rows.filter((row) => row.name.toLowerCase() === name).length);
  }
}

export const GetExerciseCategoryNameCountQuery = new GetExerciseCategoryNameCountQueryDrizzle();
