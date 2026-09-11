// cSpell:ignore ilike
import type * as tools from "@bgord/tools";
import { desc, ilike } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class SearchExercisesQueryDrizzle implements Exercises.Queries.SearchExercises {
  async execute(
    name: Exercises.VO.ExerciseNameType,
    limit: tools.IntegerPositiveType,
  ): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    const exercises = await db
      .select()
      .from(Schema.exercises)
      .where(ilike(Schema.exercises.name, name))
      .orderBy(desc(Schema.exercises.updatedAt))
      .limit(limit);

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      image: exercise.image,
      imageEtag: exercise.imageEtag,
    }));
  }
}

export const SearchExercisesQuery = new SearchExercisesQueryDrizzle();
