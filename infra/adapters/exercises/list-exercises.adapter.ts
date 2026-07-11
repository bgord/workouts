import * as tools from "@bgord/tools";
import { desc } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesQueryDrizzle implements Exercises.Queries.ListExercises {
  async execute(): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    const exercises = await db.select().from(Schema.exercises).orderBy(desc(Schema.exercises.updatedAt));

    return exercises.map((exercise) => ({
      id: v.parse(Exercises.VO.ExerciseId, exercise?.id),
      name: v.parse(Exercises.VO.ExerciseName, exercise?.name),
      description: v.parse(Exercises.VO.ExerciseDescription, exercise?.description),
      image: v.parse(tools.ObjectKey, exercise?.image),
    }));
  }
}

export const ListExercisesQuery = new ListExercisesQueryDrizzle();
