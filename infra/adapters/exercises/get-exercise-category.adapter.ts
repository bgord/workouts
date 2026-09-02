import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseCategoryQueryDrizzle implements Exercises.Queries.GetExerciseCategory {
  async execute(
    exerciseCategoryId: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<Exercises.VO.ExerciseCategory | null> {
    const exerciseCategory = await db
      .select()
      .from(Schema.exerciseCategories)
      .where(eq(Schema.exerciseCategories.id, exerciseCategoryId))
      .limit(1);

    if (!exerciseCategory[0]) return null;

    return {
      id: exerciseCategory[0].id,
      name: exerciseCategory[0].name,
      userId: exerciseCategory[0].userId,
    };
  }
}

export const GetExerciseCategoryQuery = new GetExerciseCategoryQueryDrizzle();
