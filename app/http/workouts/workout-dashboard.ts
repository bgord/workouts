import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  Clock: bg.ClockPort;
  GetWorkoutDashboardQuery: Workouts.Queries.GetWorkoutDashboard;
};

export const WorkoutDashboard =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const userId = context.identity.authenticatedUserId();

    const dashboard = await deps.GetWorkoutDashboardQuery.execute(userId, deps.Clock.now());

    return Response.json(dashboard);
  };
