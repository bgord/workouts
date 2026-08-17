import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = { SearchExerciseCategoriesQuery: Exercises.Queries.SearchExerciseCategories };

export const ExerciseCategorySearch =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const name = v.parse(Exercises.VO.ExerciseCategoryName, body["search"]);

    const exerciseCategories = await deps.SearchExerciseCategoriesQuery.execute(name, tools.Int.positive(5));

    return Response.json(exerciseCategories);
  };
