import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseCategoryNameCountQueryDrizzle implements Exercises.Queries.GetExerciseCategoryNameCount {
  async execute(
    exerciseCategoryName: Exercises.VO.ExerciseCategoryNameType,
  ): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.exerciseCategories,
      eq(Schema.exerciseCategories.name, exerciseCategoryName),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetExerciseCategoryNameCountQuery = new GetExerciseCategoryNameCountQueryDrizzle();
