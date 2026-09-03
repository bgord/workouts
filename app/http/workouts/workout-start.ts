import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Workouts.Commands.WorkoutStartCommandType>;
};

export const WorkoutStart =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const requesterId = context.identity.authenticatedUserId();
    const workoutId = v.parse(Workouts.VO.WorkoutId, params["workoutId"]);

    const command = bg.command(
      Workouts.Commands.WorkoutStartCommand,
      { revision: context.middleware.revision.fromWeakETag(), payload: { workoutId, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
