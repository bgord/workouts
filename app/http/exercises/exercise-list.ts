import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

type Dependencies = { ListExercisesWithCategoriesQuery: Exercises.Queries.ListExercisesWithCategories };

export const ExerciseList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const requesterId = context.identity.authenticatedUserId();

    const exercises = await deps.ListExercisesWithCategoriesQuery.execute(requesterId);

    return Response.json(exercises);
  };
