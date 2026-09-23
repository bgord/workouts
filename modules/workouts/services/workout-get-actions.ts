import type * as tools from "@bgord/tools";
import * as bg from "@bgord/bun";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { WorkoutExerciseLimit } from "../invariants/workout-exercise-limit";
import { WorkoutExercisesHaveTargets } from "../invariants/workout-exercises-have-targets";
import { WorkoutExists } from "../invariants/workout-exists";
import { WorkoutHasExercises } from "../invariants/workout-has-exercises";
import { WorkoutHasLoggedSets } from "../invariants/workout-has-logged-sets";
import { WorkoutInProgressLimitForOwner } from "../invariants/workout-in-progress-limit-for-owner";
import { WorkoutIsDraft } from "../invariants/workout-is-draft";
import { WorkoutIsEditable } from "../invariants/workout-is-editable";
import { WorkoutIsInProgress } from "../invariants/workout-is-in-progress";

type WorkoutGetActionsFacts = {
  status: VO.WorkoutStatusEnum;
  exercises: Array<
    Pick<VO.WorkoutExercise, "id"> & {
      target?: VO.ExerciseTargetType | null;
      loggedSets: ReadonlyArray<unknown>;
    }
  >;
  inProgressCount: tools.IntegerNonNegativeType;
};

export class WorkoutGetActions {
  constructor(private readonly facts: WorkoutGetActionsFacts) {}

  calculate(): Queries.WorkoutGetResponse["actions"] {
    const draft = WorkoutIsDraft.passes({ status: this.facts.status });
    const exists = WorkoutExists.passes({ status: this.facts.status });
    const inProgress = WorkoutIsInProgress.passes({ status: this.facts.status });

    return {
      start: bg.ActionState.of(draft, [
        bg.ActionBlocker.from(WorkoutHasExercises, { workoutExercises: this.facts.exercises }),
        bg.ActionBlocker.from(WorkoutExercisesHaveTargets, { workoutExercises: this.facts.exercises }),
        bg.ActionBlocker.from(WorkoutInProgressLimitForOwner, { count: this.facts.inProgressCount }),
      ]),
      complete: bg.ActionState.of(inProgress, [
        bg.ActionBlocker.from(WorkoutHasLoggedSets, { workoutExercises: this.facts.exercises }),
      ]),
      discard: bg.ActionState.of(exists),
      exerciseAdd: bg.ActionState.of(WorkoutIsEditable.passes({ status: this.facts.status }), [
        bg.ActionBlocker.from(WorkoutExerciseLimit, { workoutExercises: this.facts.exercises }),
      ]),
      noteSet: bg.ActionState.of(exists),
      reschedule: bg.ActionState.of(draft),
      reorder: bg.ActionState.of(inProgress && this.facts.exercises.length > 1),
    };
  }
}
