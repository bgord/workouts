import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { ExercisePerformanceLowestRir } from "./exercise-performance-lowest-rir";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";
import { RirBelowTarget } from "./rir-below-target";

type Config = {
  prescription: VO.ExercisePrescriptionType;
  performance: Pick<Queries.ExercisePerformance, "sets">;
};

export class ExercisePrescriptionMissed {
  constructor(private readonly config: Config) {}

  calculate(): boolean {
    const { prescription, performance } = this.config;
    const weakest = new ExercisePerformanceWeakestSet(performance).calculate();
    const rir = new ExercisePerformanceLowestRir(performance).calculate();

    if (weakest.sets < prescription.sets) return true;
    if (weakest.reps < prescription.reps.min) return true;

    return new RirBelowTarget({ target: prescription.rir, rir }).calculate();
  }
}
