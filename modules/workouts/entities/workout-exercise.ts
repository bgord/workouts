import * as v from "valibot";
import type * as Exercises from "+exercises";
import * as Invariants from "+workouts/invariants";
import * as VO from "+workouts/value-objects";

export class WorkoutExercise implements VO.WorkoutExercise {
  target?: VO.ExerciseTargetType;
  loggedSets: Array<VO.LoggedSetType> = [];

  constructor(
    readonly id: VO.WorkoutExerciseIdType,
    readonly exerciseId: Exercises.VO.ExerciseIdType,
    readonly exerciseName: VO.WorkoutExerciseNameType,
    readonly resistance: VO.WorkoutExerciseResistanceType,
    readonly laterality: VO.WorkoutExerciseLateralityType,
    readonly prescription: VO.ExercisePrescriptionType,
  ) {}

  guardTargetSet(target: VO.ExerciseTargetType) {
    Invariants.WorkoutExerciseTargetHasChanged.enforce({ current: this.target, incoming: target });
    Invariants.WorkoutExerciseLoadIsApplicable.enforce({ resistance: this.resistance, load: target.load });
  }

  nextSet(
    id: VO.LoggedSetIdType,
    reps: VO.RepsType,
    load: VO.LoadType,
    rir: VO.RirType | undefined,
  ): VO.LoggedSetType {
    Invariants.WorkoutExerciseLoadIsApplicable.enforce({ resistance: this.resistance, load });

    return { id, setNumber: v.parse(VO.SetNumber, this.loggedSets.length + 1), reps, load, rir };
  }

  guardLoggedSetExists(loggedSetId: VO.LoggedSetIdType) {
    Invariants.WorkoutLoggedSetExists.enforce({ workoutExercise: this, loggedSetId });
  }

  correction(
    id: VO.LoggedSetIdType,
    reps: VO.RepsType,
    load: VO.LoadType,
    rir: VO.RirType | undefined,
  ): VO.LoggedSetType {
    this.guardLoggedSetExists(id);
    Invariants.WorkoutExerciseLoadIsApplicable.enforce({ resistance: this.resistance, load });

    const current = this.loggedSets.find((loggedSet) => loggedSet.id === id)!;

    return { id, setNumber: current.setNumber, reps, load, rir };
  }

  setTarget(target: VO.ExerciseTargetType) {
    this.target = target;
  }

  logSet(loggedSet: VO.LoggedSetType) {
    this.loggedSets = [...this.loggedSets, loggedSet];
  }

  correctSet(corrected: VO.LoggedSetType) {
    this.loggedSets = this.loggedSets.map((loggedSet) =>
      loggedSet.id === corrected.id ? corrected : loggedSet,
    );
  }

  removeSet(loggedSetId: VO.LoggedSetIdType) {
    this.loggedSets = this.loggedSets
      .filter((loggedSet) => loggedSet.id !== loggedSetId)
      .map((loggedSet, index) => ({ ...loggedSet, setNumber: v.parse(VO.SetNumber, index + 1) }));
  }
}
