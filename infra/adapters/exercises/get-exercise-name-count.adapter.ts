import * as tools from "@bgord/tools";
import { ne } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseNameCountQueryDrizzle implements Exercises.Queries.GetExerciseNameCount {
  async execute(
    exerciseName: Exercises.VO.ExerciseNameType,
    excludedExerciseId?: Exercises.VO.ExerciseIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    const rows = await db
      .select({ name: Schema.exercises.name })
      .from(Schema.exercises)
      .where(excludedExerciseId ? ne(Schema.exercises.id, excludedExerciseId) : undefined);

    const name = exerciseName.toLowerCase();

    return tools.Int.nonNegative(rows.filter((row) => row.name.toLowerCase() === name).length);
  }
}

export const GetExerciseNameCountQuery = new GetExerciseNameCountQueryDrizzle();
