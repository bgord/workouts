import * as tools from "@bgord/tools";
import type * as VO from "+workouts/value-objects";

type VolumeSet = { reps: VO.RepsType; load: VO.LoadType };

export class LoggedSetsVolume {
  constructor(private readonly sets: ReadonlyArray<VolumeSet>) {}

  calculate(): tools.Weight {
    return this.sets.reduce(
      (total, set) => total.add(tools.Weight.fromGrams(set.reps * set.load)),
      tools.Weight.zero(),
    );
  }
}
