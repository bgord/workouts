import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as Statistics from "+statistics";

type Dependencies = { ExerciseOneRepMaxEstimator: Statistics.Services.ExerciseOneRepMaxEstimator };

export const ExerciseOneRepMaxEstimateGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();
    const params = context.request.params();

    const exerciseId = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const estimate = await deps.ExerciseOneRepMaxEstimator.estimate(userId, exerciseId);

    return Response.json({ estimate });
  };
