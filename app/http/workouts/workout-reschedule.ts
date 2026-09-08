import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutRescheduleCommandType>;
};

export const WorkoutReschedule =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);
    const scheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, body["scheduledFor"]);

    const command = bg.command(
      Workouts.Commands.WorkoutRescheduleCommand,
      {
        revision: context.middleware.revision.fromWeakETag(),
        payload: { workoutId, scheduledFor, requesterId },
      },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
