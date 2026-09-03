import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutCreateCommandType>;
};

export const WorkoutCreate =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, deps.IdProvider.generate());
    const planId = v.parse(Plans.VO.PlanId, body["planId"]);
    const scheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, body["scheduledFor"]);

    const command = bg.command(
      Workouts.Commands.WorkoutCreateCommand,
      { payload: { workoutId, planId, scheduledFor, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
