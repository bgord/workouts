import type hono from "hono";
import type * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = { ListExerciseCategoriesQuery: Exercises.Queries.ListExerciseCategories };

export const ExerciseCategoryList = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const exerciseCategories = await deps.ListExerciseCategoriesQuery.execute();

  return c.json(exerciseCategories);
};
