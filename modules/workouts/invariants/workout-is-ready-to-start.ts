import * as bg from "@bgord/bun";
import type * as VO from "+workouts/value-objects";

class WorkoutIsReadyToStartError extends Error {}

type WorkoutIsReadyToStartConfigType = { workoutExercises: Array<VO.WorkoutExercise> };

class WorkoutIsReadyToStartFactory extends bg.Invariant<WorkoutIsReadyToStartConfigType> {
  passes(config: WorkoutIsReadyToStartConfigType) {
    return (
      config.workoutExercises.length > 0 &&
      config.workoutExercises.every((exercise) => exercise.target !== undefined)
    );
  }

  // Stryker disable next-line StringLiteral
  message = "workout.is.ready.to.start";
  error = WorkoutIsReadyToStartError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WorkoutIsReadyToStart = new WorkoutIsReadyToStartFactory();
