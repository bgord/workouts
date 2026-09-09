import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as Statistics from "+statistics";

type Dependencies = { ExerciseBestSetPicker: Statistics.Services.ExerciseBestSetPicker };

export const ExerciseBestSetGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();
    const params = context.request.params();

    const exerciseId = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const bestSet = await deps.ExerciseBestSetPicker.pick(userId, exerciseId);

    return Response.json({ bestSet });
  };
