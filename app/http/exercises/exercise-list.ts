import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";

type Dependencies = { ListExercisesQuery: Exercises.Queries.ListExercises };

export const ExerciseList =
  (deps: Dependencies): bg.EndpointPort =>
  async () => {
    const exercises = await deps.ListExercisesQuery.execute();

    return Response.json(exercises);
  };
