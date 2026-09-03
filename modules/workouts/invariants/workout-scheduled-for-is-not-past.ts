import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as VO from "+workouts/value-objects";

class WorkoutScheduledForIsNotPastError extends Error {}

type WorkoutScheduledForIsNotPastConfigType = {
  scheduledFor: VO.WorkoutScheduledForType;
  today: tools.DayIsoIdType;
};

class WorkoutScheduledForIsNotPastFactory extends bg.Invariant<WorkoutScheduledForIsNotPastConfigType> {
  passes(config: WorkoutScheduledForIsNotPastConfigType) {
    return config.scheduledFor >= config.today;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.scheduled.for.is.not.past";
  error = WorkoutScheduledForIsNotPastError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutScheduledForIsNotPast = new WorkoutScheduledForIsNotPastFactory();
