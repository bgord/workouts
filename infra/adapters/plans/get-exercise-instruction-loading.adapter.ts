import { eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class GetExerciseInstructionLoadingQueryDrizzle implements Plans.Queries.GetExerciseInstructionLoading {
  async execute(
    exerciseInstructionId: Plans.VO.ExerciseInstructionIdType,
  ): Promise<Exercises.VO.ExerciseLoadingType | null> {
    const exercise = await db
      .select({ loading: Schema.exercises.loading })
      .from(Schema.planSectionExerciseInstructions)
      .innerJoin(Schema.exercises, eq(Schema.planSectionExerciseInstructions.exerciseId, Schema.exercises.id))
      .where(eq(Schema.planSectionExerciseInstructions.id, exerciseInstructionId))
      .get();

    return exercise?.loading ?? null;
  }
}

export const GetExerciseInstructionLoadingQuery = new GetExerciseInstructionLoadingQueryDrizzle();
