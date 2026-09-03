import { asc, eq } from "drizzle-orm";
import type * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ListExercisesWithCategoriesQueryDrizzle implements Exercises.Queries.ListExercisesWithCategories {
  async execute(): Promise<ReadonlyArray<Exercises.VO.ExerciseWithCategories>> {
    const exercises = await db.select().from(Schema.exercises).orderBy(asc(Schema.exercises.name));

    const assignments = await db
      .select({
        exerciseId: Schema.exerciseCategoryAssignments.exerciseId,
        id: Schema.exerciseCategories.id,
        name: Schema.exerciseCategories.name,
      })
      .from(Schema.exerciseCategoryAssignments)
      .innerJoin(
        Schema.exerciseCategories,
        eq(Schema.exerciseCategoryAssignments.exerciseCategoryId, Schema.exerciseCategories.id),
      )
      .orderBy(asc(Schema.exerciseCategories.name));

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      image: exercise.image,
      categories: assignments
        .filter((assignment) => assignment.exerciseId === exercise.id)
        .map((assignment) => ({ id: assignment.id, name: assignment.name })),
    }));
  }
}

export const ListExercisesWithCategoriesQuery = new ListExercisesWithCategoriesQueryDrizzle();
