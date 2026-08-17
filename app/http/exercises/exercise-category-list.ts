import type * as Exercises from "+exercises";

type Dependencies = { ListExerciseCategoriesQuery: Exercises.Queries.ListExerciseCategories };

export const ExerciseCategoryList = (deps: Dependencies) => async () => {
  const exerciseCategories = await deps.ListExerciseCategoriesQuery.execute();

  return Response.json(exerciseCategories);
};
