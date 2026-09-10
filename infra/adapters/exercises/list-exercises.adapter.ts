import { desc } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesQueryDrizzle implements Exercises.Queries.ListExercises {
  async execute(): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    const exercises = await db.select().from(Schema.exercises).orderBy(desc(Schema.exercises.updatedAt));

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      image: exercise.image,
      imageEtag: exercise.imageEtag,
    }));
  }
}

export const ListExercisesQuery = new ListExercisesQueryDrizzle();
