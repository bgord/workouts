import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

type Dependencies = { ListExerciseCategoriesQuery: Exercises.Queries.ListExerciseCategories };

export const ExerciseCategoryList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const requesterId = context.identity.authenticatedUserId();

    const exerciseCategories = await deps.ListExerciseCategoriesQuery.execute(requesterId);

    return Response.json(exerciseCategories);
  };
