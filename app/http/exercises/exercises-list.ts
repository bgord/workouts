import type hono from "hono";
import type * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = { ListExercisesQuery: Exercises.Queries.ListExercises };

export const ExercisesList = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const exercises = await deps.ListExercisesQuery.execute();

  return c.json(exercises);
};
