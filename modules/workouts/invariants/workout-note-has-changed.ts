import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutNoteHasChangedError extends Error {}

type WorkoutNoteHasChangedConfigType = {
  current: VO.WorkoutNoteType | undefined;
  incoming: VO.WorkoutNoteType | undefined;
};

class WorkoutNoteHasChangedFactory extends bg.Invariant<WorkoutNoteHasChangedConfigType> {
  passes(config: WorkoutNoteHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "workout.note.has.changed";
  error = WorkoutNoteHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutNoteHasChanged = new WorkoutNoteHasChangedFactory();
