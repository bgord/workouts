import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseUsageCountQueryDrizzle implements Exercises.Queries.GetExerciseUsageCount {
  async execute(exerciseId: Exercises.VO.ExerciseIdType): Promise<tools.IntegerNonNegativeType> {
    const count = await db.$count(
      Schema.planSectionExerciseInstructions,
      eq(Schema.planSectionExerciseInstructions.exerciseId, exerciseId),
    );

    return tools.Int.nonNegative(count);
  }
}

export const GetExerciseUsageCountQuery = new GetExerciseUsageCountQueryDrizzle();
