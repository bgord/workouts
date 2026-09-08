import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as Stats from "+stats";

type Dependencies = { GetExerciseHistoryQuery: Stats.Queries.GetExerciseHistory };

export const ExerciseHistoryGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const exerciseId = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const history = await deps.GetExerciseHistoryQuery.execute(exerciseId, userId);

    return Response.json(history);
  };
