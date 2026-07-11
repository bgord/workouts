import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseNameCountQueryDrizzle implements Exercises.Queries.GetExerciseNameCount {
  async execute(exerciseName: Exercises.VO.ExerciseNameType): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(Schema.exercises, eq(Schema.exerciseCategories.name, exerciseName));

    return tools.Int.nonNegative(count);
  }
}

export const GetExerciseNameCountQuery = new GetExerciseNameCountQueryDrizzle();
