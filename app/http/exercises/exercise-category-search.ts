import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = { SearchExerciseCategoriesQuery: Exercises.Queries.SearchExerciseCategories };

export const ExerciseCategorySearch = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const body = await context.request.json();

  const name = v.parse(Exercises.VO.ExerciseCategoryName, body["search"]);

  const exerciseCategories = await deps.SearchExerciseCategoriesQuery.execute(name, tools.Int.positive(5));

  return c.json(exerciseCategories);
};
