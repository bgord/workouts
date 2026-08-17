import type * as Exercises from "+exercises";

type Dependencies = { ListExercisesQuery: Exercises.Queries.ListExercises };

export const ExerciseList = (deps: Dependencies) => async () => {
  const exercises = await deps.ListExercisesQuery.execute();

  return Response.json(exercises);
};
