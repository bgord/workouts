import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseInstructionResistanceQueryDrizzle implements Plans.Queries.GetExerciseInstructionResistance {
  async execute(
    exerciseInstructionId: Plans.VO.ExerciseInstructionIdType,
  ): Promise<Exercises.VO.ExerciseResistanceType | null> {
    const exercise = await db
      .select({ resistance: Schema.exercises.resistance })
      .from(Schema.planSectionExerciseInstructions)
      .innerJoin(Schema.exercises, eq(Schema.planSectionExerciseInstructions.exerciseId, Schema.exercises.id))
      .where(eq(Schema.planSectionExerciseInstructions.id, exerciseInstructionId))
      .get();

    return exercise?.resistance ?? null;
  }
}

export const GetExerciseInstructionResistanceQuery = new GetExerciseInstructionResistanceQueryDrizzle();
