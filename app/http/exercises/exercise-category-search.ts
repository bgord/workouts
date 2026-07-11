import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = { SearchExerciseCategoriesQuery: Exercises.Queries.SearchExerciseCategories };

export const ExerciseCategorySearch = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const name = v.parse(Exercises.VO.ExerciseCategoryName, c.req.query("search"));

  const exerciseCategories = await deps.SearchExerciseCategoriesQuery.execute(name, tools.Int.positive(5));

  return c.json(exerciseCategories);
};
