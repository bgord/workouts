import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

type Dependencies = { ListExercisesWithCategoriesQuery: Exercises.Queries.ListExercisesWithCategories };

export const ExerciseList =
  (deps: Dependencies): bg.EndpointPort =>
  async () => {
    const exercises = await deps.ListExercisesWithCategoriesQuery.execute();

    return Response.json(exercises);
  };
