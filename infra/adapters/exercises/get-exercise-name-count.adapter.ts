import * as tools from "@bgord/tools";
import { and, eq, ne } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseNameCountQueryDrizzle implements Exercises.Queries.GetExerciseNameCount {
  async execute(
    exerciseName: Exercises.VO.ExerciseNameType,
    excludedExerciseId?: Exercises.VO.ExerciseIdType,
  ): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.exercises,
      and(
        eq(Schema.exercises.name, exerciseName),
        excludedExerciseId ? ne(Schema.exercises.id, excludedExerciseId) : undefined,
      ),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetExerciseNameCountQuery = new GetExerciseNameCountQueryDrizzle();
