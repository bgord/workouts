import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { WorkoutExerciseHasNoLoggedSets } from "../invariants/workout-exercise-has-no-logged-sets";
import { WorkoutExercisePositionHasChanged } from "../invariants/workout-exercise-position-has-changed";
import { WorkoutExercisePositionInRange } from "../invariants/workout-exercise-position-in-range";
import { WorkoutIsEditable } from "../invariants/workout-is-editable";
import { WorkoutIsInProgress } from "../invariants/workout-is-in-progress";

type WorkoutGetExerciseActionsFacts = {
  status: VO.WorkoutStatusEnum;
  exercises: Array<Pick<VO.WorkoutExercise, "id">>;
  exercise: Pick<VO.WorkoutExercise, "id"> & { loggedSets: ReadonlyArray<Pick<VO.LoggedSetType, "id">> };
  catalogExerciseExists: boolean;
};

export class WorkoutGetExerciseActions {
  constructor(private readonly facts: WorkoutGetExerciseActionsFacts) {}

  calculate(): Queries.WorkoutExerciseActions {
    const editable = WorkoutIsEditable.passes({ status: this.facts.status });
    const inProgress = WorkoutIsInProgress.passes({ status: this.facts.status });
    const reorderable = editable && this.facts.exercises.length > 1;

    const current = this.facts.exercises.findIndex((exercise) => exercise.id === this.facts.exercise.id);

    return {
      targetSet: bg.ActionState.of(
        editable && WorkoutExerciseHasNoLoggedSets.passes({ loggedSets: this.facts.exercise.loggedSets }),
      ),
      remove: bg.ActionState.of(editable),
      moveUp: bg.ActionState.of(reorderable, [
        bg.ActionBlocker.from(WorkoutExercisePositionHasChanged, {
          workoutExerciseId: this.facts.exercise.id,
          workoutExercises: this.facts.exercises,
          position: v.parse(VO.WorkoutExercisePosition, Math.max(current - 1, 0)),
        }),
      ]),
      moveDown: bg.ActionState.of(reorderable, [
        bg.ActionBlocker.from(WorkoutExercisePositionInRange, {
          workoutExercises: this.facts.exercises,
          position: v.parse(VO.WorkoutExercisePosition, current + 1),
        }),
      ]),
      setLog: bg.ActionState.of(inProgress),
      catalogView: bg.ActionState.of(this.facts.catalogExerciseExists),
    };
  }
}
