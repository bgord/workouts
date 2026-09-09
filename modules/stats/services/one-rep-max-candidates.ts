import type * as Ports from "+stats/ports";
import type * as VO from "+stats/value-objects";
import { EstimatedRecordOrder } from "./estimated-record-order";

type Dependencies = { OneRepMaxEstimator: Ports.OneRepMaxEstimatorPort };

type Session = Pick<VO.ExerciseSession, "workoutId" | "completedAt" | "sets">;

export class OneRepMaxCandidates {
  constructor(private readonly deps: Dependencies) {}

  from(session: Session): Array<VO.EstimatedRecord> {
    return session.sets
      .flatMap((set) => {
        const oneRepMaxEstimate = this.deps.OneRepMaxEstimator.estimate(set);

        if (oneRepMaxEstimate === undefined) return [];

        return [
          { ...set, workoutId: session.workoutId, completedAt: session.completedAt, oneRepMaxEstimate },
        ];
      })
      .toSorted((one, another) => EstimatedRecordOrder.compare(one, another));
  }
}
