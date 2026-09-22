import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseQueryDrizzle implements Exercises.Queries.GetExercise {
  async execute(exerciseId: Exercises.VO.ExerciseIdType): Promise<Exercises.VO.Exercise | null> {
    const exercise = await db
      .select({
        id: Schema.exercises.id,
        name: Schema.exercises.name,
        description: Schema.exercises.description,
        image: Schema.exercises.image,
        imageEtag: Schema.exercises.imageEtag,
      })
      .from(Schema.exercises)
      .where(eq(Schema.exercises.id, exerciseId))
      .get();

    return exercise ?? null;
  }
}

export const GetExerciseQuery = new GetExerciseQueryDrizzle();
