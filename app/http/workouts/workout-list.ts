import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = { ListWorkoutsQuery: Workouts.Queries.ListWorkouts };

export const WorkoutList =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const workouts = await deps.ListWorkoutsQuery.execute(userId);

    return Response.json(workouts);
  };
