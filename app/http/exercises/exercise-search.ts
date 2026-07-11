import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = { SearchExercisesQuery: Exercises.Queries.SearchExercises };

export const ExerciseSearch = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const name = v.parse(Exercises.VO.ExerciseName, c.req.query("search"));

  const exercises = await deps.SearchExercisesQuery.execute(name, tools.Int.positive(5));

  return c.json(exercises);
};
