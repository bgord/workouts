import { asc, count, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseCategoriesQueryDrizzle implements Exercises.Queries.ListExerciseCategories {
  async execute(requesterId: Auth.VO.UserIdType): Promise<Exercises.Queries.ExerciseCategoryListResponse> {
    const data = await db
      .select({ id: Schema.exerciseCategories.id, name: Schema.exerciseCategories.name })
      .from(Schema.exerciseCategories)
      .leftJoin(
        Schema.exerciseCategoryAssignments,
        eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, Schema.exerciseCategories.id),
      )
      .groupBy(Schema.exerciseCategories.id)
      .orderBy(
        desc(count(Schema.exerciseCategoryAssignments.exerciseId)),
        asc(Schema.exerciseCategories.name),
      );

    return { data, actions: new Exercises.Services.ExerciseCategoryListActions({ requesterId }).calculate() };
  }
}

export const ListExerciseCategoriesQuery = new ListExerciseCategoriesQueryDrizzle();
