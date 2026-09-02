import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseQueryDrizzle implements Exercises.Queries.GetExercise {
  async execute(exerciseId: Exercises.VO.ExerciseIdType): Promise<Exercises.VO.Exercise | null> {
    const exercise = await db
      .select()
      .from(Schema.exercises)
      .where(eq(Schema.exercises.id, exerciseId))
      .limit(1);

    if (!exercise[0]) return null;

    return {
      id: exercise[0].id,
      name: exercise[0].name,
      description: exercise[0].description,
      image: exercise[0].image,
      userId: exercise[0].userId,
    };
  }
}

export const GetExerciseQuery = new GetExerciseQueryDrizzle();
