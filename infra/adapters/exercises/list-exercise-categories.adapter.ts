import { asc, count, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExerciseCategoriesQueryDrizzle implements Exercises.Queries.ListExerciseCategories {
  async execute(requesterId: Auth.VO.UserIdType): Promise<Exercises.Queries.ExerciseCategoryListResponse> {
    const exerciseCategories = await db
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

    const data = exerciseCategories.map((exerciseCategory) => ({
      id: exerciseCategory.id,
      name: exerciseCategory.name,
    }));

    const managed = Exercises.Invariants.CatalogIsManagedByAdmin.passes({ requesterId });
    const whenManaged = { available: managed, enabled: managed, hints: [] };

    return { data, actions: { add: whenManaged, rename: whenManaged, delete: whenManaged } };
  }
}

export const ListExerciseCategoriesQuery = new ListExerciseCategoriesQueryDrizzle();
