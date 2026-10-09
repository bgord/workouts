import * as tools from "@bgord/tools";
import * as VO from "+workouts/value-objects";

type VolumeSet = { reps: VO.RepsType; load: VO.LoadType; laterality: VO.WorkoutExerciseLateralityType };

export class LoggedSetsVolume {
  constructor(private readonly sets: ReadonlyArray<VolumeSet>) {}

  calculate(): tools.Weight {
    return this.sets.reduce(
      (total, set) =>
        total.add(
          tools.Weight.fromGrams(set.load * VO.WorkoutExerciseSides.totalReps(set.laterality, set.reps)),
        ),
      tools.Weight.zero(),
    );
  }
}
