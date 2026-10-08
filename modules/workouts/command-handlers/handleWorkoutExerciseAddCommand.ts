// biome-ignore-all lint: lint/style/noNonNullAssertion
import type * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import { WorkoutCatalogExerciseExists } from "../invariants/workout-catalog-exercise-exists";
import { WorkoutExerciseProgressionIsApplicable } from "../invariants/workout-exercise-progression-is-applicable";
import { WorkoutExerciseDescription } from "../value-objects/workout-exercise-description";
import { WorkoutExerciseLaterality } from "../value-objects/workout-exercise-laterality";
import { WorkoutExerciseName } from "../value-objects/workout-exercise-name";
import { WorkoutExerciseResistance } from "../value-objects/workout-exercise-resistance";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
  GetExerciseOHQ: Exercises.OHQ.GetExerciseOHQ;
};

export const handleWorkoutExerciseAddCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutExerciseAddCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);

    const exercise = await deps.GetExerciseOHQ.execute(command.payload.exerciseId);

    WorkoutCatalogExerciseExists.enforce({ exercise });
    WorkoutExerciseProgressionIsApplicable.enforce({
      resistance: exercise!.resistance,
      progression: command.payload.prescription.progression,
    });

    workout.addExercise(
      command.payload.workoutExerciseId,
      exercise!.id,
      v.parse(WorkoutExerciseName, exercise!.name),
      v.parse(WorkoutExerciseDescription, exercise!.description),
      v.parse(WorkoutExerciseResistance, exercise!.resistance),
      v.parse(WorkoutExerciseLaterality, exercise!.laterality),
      command.payload.prescription,
      command.payload.requesterId,
    );
    await deps.repo.save(workout);
  };
