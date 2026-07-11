import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
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
      id: v.parse(Exercises.VO.ExerciseId, exercise[0].id),
      name: v.parse(Exercises.VO.ExerciseName, exercise[0].name),
      description: v.parse(Exercises.VO.ExerciseDescription, exercise[0].description),
      image: v.parse(tools.ObjectKey, exercise[0].image),
    };
  }
}

export const GetExerciseQuery = new GetExerciseQueryDrizzle();
