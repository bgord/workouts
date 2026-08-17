import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  GetExerciseQuery: Exercises.Queries.GetExercise;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export const ExerciseGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const id = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const exercise = await deps.GetExerciseQuery.execute(id);

    if (!exercise) return new Response(null, { status: 404 });

    const categories = await deps.ListCategoriesAssignedToExerciseQuery.execute(id);

    return Response.json({ ...exercise, categories });
  };
