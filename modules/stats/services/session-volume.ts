import * as v from "valibot";
import * as VO from "+stats/value-objects";

class SessionVolumeFactory {
  calculate(sets: ReadonlyArray<VO.PerformedSet>): VO.VolumeType {
    return v.parse(
      VO.Volume,
      sets.reduce((total, set) => total + set.reps * set.load, 0),
    );
  }
}

export const SessionVolume = new SessionVolumeFactory();
