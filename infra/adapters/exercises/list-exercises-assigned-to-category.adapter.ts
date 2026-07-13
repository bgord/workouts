import * as tools from "@bgord/tools";
import { desc, eq } from "drizzle-orm";
import * as v from "valibot";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesAssignedToCategoryQueryDrizzle
  implements Exercises.Queries.ListExercisesAssignedToCategory
{
  async execute(
    exerciseCategoryId: Exercises.VO.ExerciseCategoryIdType,
  ): Promise<ReadonlyArray<Exercises.VO.Exercise>> {
    const result = await db
      .select()
      .from(Schema.exercises)
      .innerJoin(
        Schema.exerciseCategoryAssignments,
        eq(Schema.exercises.id, Schema.exerciseCategoryAssignments.exerciseId),
      )
      .where(eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, exerciseCategoryId))
      .orderBy(desc(Schema.exercises.updatedAt));

    return result.map((row) => ({
      id: v.parse(Exercises.VO.ExerciseId, row.exercises?.id),
      name: v.parse(Exercises.VO.ExerciseName, row.exercises?.name),
      description: v.parse(Exercises.VO.ExerciseDescription, row.exercises?.description),
      image: v.parse(tools.ObjectKey, row.exercises?.image),
    }));
  }
}

export const ListExercisesAssignedToCategoryQuery = new ListExercisesAssignedToCategoryQueryDrizzle();
