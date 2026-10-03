import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+workouts/value-objects";
import { WorkoutScheduledForHorizonDaysMax } from "../value-objects/workout-scheduled-for-horizon";

class WorkoutScheduledForIsWithinHorizonError extends Error {}

type WorkoutScheduledForIsWithinHorizonConfigType = {
  scheduledFor: VO.WorkoutScheduledForType;
  now: tools.Timestamp;
};

class WorkoutScheduledForIsWithinHorizonFactory extends bg.Invariant<WorkoutScheduledForIsWithinHorizonConfigType> {
  passes(config: WorkoutScheduledForIsWithinHorizonConfigType) {
    const today = tools.Day.fromTimestamp(config.now);

    const earliest = today.shift(v.parse(tools.Integer, -WorkoutScheduledForHorizonDaysMax)).toIsoId();
    const latest = today.shift(v.parse(tools.Integer, WorkoutScheduledForHorizonDaysMax)).toIsoId();

    return config.scheduledFor >= earliest && config.scheduledFor <= latest;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.scheduled.for.is.within.horizon";
  error = WorkoutScheduledForIsWithinHorizonError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutScheduledForIsWithinHorizon = new WorkoutScheduledForIsWithinHorizonFactory();
