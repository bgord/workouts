// cSpell:ignore ilike
import * as tools from "@bgord/tools";
import { desc, ilike } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
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
      id: v.parse(Exercises.VO.ExerciseId, exercise?.id),
      name: v.parse(Exercises.VO.ExerciseName, exercise?.name),
      description: v.parse(Exercises.VO.ExerciseDescription, exercise?.description),
      image: v.parse(tools.ObjectKey, exercise?.image),
    }));
  }
}

export const SearchExercisesQuery = new SearchExercisesQueryDrizzle();
