import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = { ListWorkoutsQuery: Workouts.Queries.ListWorkouts };

export const WorkoutList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const filter =
      v.parse(Workouts.VO.WorkoutListFilter, body["filter"]) ??
      Workouts.VO.WorkoutListFilterOptions.last_week;

    const workouts = await deps.ListWorkoutsQuery.execute(userId, filter);

    return Response.json(workouts);
  };
