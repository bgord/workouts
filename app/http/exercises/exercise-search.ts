import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = { SearchExercisesQuery: Exercises.Queries.SearchExercises };

export const ExerciseSearch =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const name = v.parse(Exercises.VO.ExerciseName, body["search"]);

    const exercises = await deps.SearchExercisesQuery.execute(name, tools.Int.positive(5));

    return Response.json(exercises);
  };
