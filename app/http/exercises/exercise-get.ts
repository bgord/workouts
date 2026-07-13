import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  GetExerciseQuery: Exercises.Queries.GetExercise;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export const ExerciseGet = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const id = v.parse(Exercises.VO.ExerciseId, c.req.param("exerciseId"));

  const exercise = await deps.GetExerciseQuery.execute(id);

  if (!exercise) return c.notFound();

  const categories = await deps.ListCategoriesAssignedToExerciseQuery.execute(id);

  return c.json({ ...exercise, categories });
};
