import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseCategoryQueryDrizzle implements Exercises.Queries.GetExerciseCategory {
  async execute(
    exerciseCategoryId: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<Exercises.VO.ExerciseCategory | null> {
    const exerciseCategory = await db
      .select({ id: Schema.exerciseCategories.id, name: Schema.exerciseCategories.name })
      .from(Schema.exerciseCategories)
      .where(eq(Schema.exerciseCategories.id, exerciseCategoryId))
      .get();

    return exerciseCategory ?? null;
  }
}

export const GetExerciseCategoryQuery = new GetExerciseCategoryQueryDrizzle();
