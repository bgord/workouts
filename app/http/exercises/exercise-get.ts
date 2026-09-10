import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = { GetExerciseWithCategoriesQuery: Exercises.Queries.GetExerciseWithCategories };

export const ExerciseGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const requesterId = context.identity.authenticatedUserId();
    const id = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const exercise = await deps.GetExerciseWithCategoriesQuery.execute(id, requesterId);

    if (!exercise) return new Response(null, { status: 404 });

    return Response.json(exercise);
  };
