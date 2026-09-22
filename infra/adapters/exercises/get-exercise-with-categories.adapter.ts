import type * as bg from "@bgord/bun";
import { asc, eq, notInArray } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { GetExerciseUsageCountQuery } from "./get-exercise-usage-count.adapter";

class GetExerciseWithCategoriesQueryDrizzle implements Exercises.Queries.GetExerciseWithCategories {
  async execute(
    exerciseId: Exercises.VO.ExerciseIdType,
    requesterId: Auth.VO.UserIdType,
  ): Promise<Exercises.Queries.ExerciseGetResponse | null> {
    const [exercise, count, assignableCategories] = await Promise.all([
      db.query.exercises.findFirst({
        columns: { id: true, name: true, description: true, image: true, imageEtag: true },
        where: (exercise, { eq }) => eq(exercise.id, exerciseId),
        with: {
          categoryAssignments: {
            columns: {},
            orderBy: (assignment, { asc }) => asc(assignment.createdAt),
            with: { category: { columns: { id: true, name: true } } },
          },
        },
      }),
      GetExerciseUsageCountQuery.execute(exerciseId),
      db
        .select({ id: Schema.exerciseCategories.id, name: Schema.exerciseCategories.name })
        .from(Schema.exerciseCategories)
        .where(
          notInArray(
            Schema.exerciseCategories.id,
            db
              .select({ id: Schema.exerciseCategoryAssignments.exerciseCategoryId })
              .from(Schema.exerciseCategoryAssignments)
              .where(eq(Schema.exerciseCategoryAssignments.exerciseId, exerciseId)),
          ),
        )
        .orderBy(asc(Schema.exerciseCategories.name)),
    ]);

    if (!exercise) return null;

    const { categoryAssignments, ...rest } = exercise;
    const categories = categoryAssignments.map((assignment) => assignment.category);

    const managed = Exercises.Invariants.CatalogIsManagedByAdmin.passes({ requesterId });
    const whenManaged = { available: managed, enabled: managed, hints: [] };

    const unused = Exercises.Invariants.ExerciseIsNotUsed.passes({ count });
    const withinLimit = Exercises.Invariants.ExerciseCategoryLimit.passes({ exerciseCategories: categories });
    const anyLeft = assignableCategories.length > 0;

    const categoryAssignHints: Array<bg.TranslationsKeyType> = [];

    if (!withinLimit) categoryAssignHints.push("exercise.category.assign.blocked.limit");
    if (!anyLeft) categoryAssignHints.push("exercise.category.assign.blocked.none_left");

    return {
      data: { ...rest, categories },
      assignableCategories,
      actions: {
        update: whenManaged,
        imageChange: whenManaged,
        delete: {
          available: managed,
          enabled: managed && unused,
          hints: unused ? [] : ["exercise.delete.blocked.in_use"],
        },
        categoryAssign: {
          available: managed,
          enabled: managed && withinLimit && anyLeft,
          hints: categoryAssignHints,
        },
        categoryUnassign: whenManaged,
      },
    };
  }
}

export const GetExerciseWithCategoriesQuery = new GetExerciseWithCategoriesQueryDrizzle();
