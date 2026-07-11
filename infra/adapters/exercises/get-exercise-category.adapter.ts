import { eq } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
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
      id: v.parse(Exercises.VO.ExerciseCategoryId, exerciseCategory[0].id),
      name: v.parse(Exercises.VO.ExerciseCategoryName, exerciseCategory[0].name),
    };
  }
}

export const GetExerciseCategoryQuery = new GetExerciseCategoryQueryDrizzle();
