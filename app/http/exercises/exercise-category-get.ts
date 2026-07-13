import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
  ListExercisesAssignedToCategoryQuery: Exercises.Queries.ListExercisesAssignedToCategory;
};

export const ExerciseCategoryGet = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const id = v.parse(Exercises.VO.ExerciseCategoryId, c.req.param("exerciseCategoryId"));

  const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(id);

  if (!exerciseCategory) return c.notFound();

  const exercises = await deps.ListExercisesAssignedToCategoryQuery.execute(id);

  return c.json({ ...exerciseCategory, exercises });
};
