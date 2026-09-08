import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Workouts from "+workouts";
import { WorkoutScheduledForIsNotPast } from "../invariants/workout-scheduled-for-is-not-past";
import { WorkoutScheduledForIsWithinHorizon } from "../invariants/workout-scheduled-for-is-within-horizon";
import { WorkoutScheduledForHorizonDaysMax } from "../value-objects/workout-scheduled-for-horizon";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutRescheduleCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutRescheduleCommandType) => {
    const today = tools.Day.fromTimestamp(deps.Clock.now());

    WorkoutScheduledForIsNotPast.enforce({
      scheduledFor: command.payload.scheduledFor,
      today: today.toIsoId(),
    });

    const horizon = today.shift(v.parse(tools.Integer, WorkoutScheduledForHorizonDaysMax)).toIsoId();

    WorkoutScheduledForIsWithinHorizon.enforce({ scheduledFor: command.payload.scheduledFor, horizon });

    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.reschedule(command.payload.scheduledFor, command.payload.requesterId);
    await deps.repo.save(workout);
  };
