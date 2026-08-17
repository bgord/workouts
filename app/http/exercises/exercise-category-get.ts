import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
  ListExercisesAssignedToCategoryQuery: Exercises.Queries.ListExercisesAssignedToCategory;
};

export const ExerciseCategoryGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const id = v.parse(Exercises.VO.ExerciseCategoryId, params["exerciseCategoryId"]);

    const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(id);

    if (!exerciseCategory) return new Response(null, { status: 404 });

    const exercises = await deps.ListExercisesAssignedToCategoryQuery.execute(id);

    return Response.json({ ...exerciseCategory, exercises });
  };
