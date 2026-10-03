import * as Plans from "+plans";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { ProgressionMethodDoubleProgressionStrategy } from "./progression-method-double-progression.strategy";
import { ProgressionMethodLinearProgressionStrategy } from "./progression-method-linear-progression.strategy";
import { ProgressionMethodNoneStrategy } from "./progression-method-none.strategy";

export class ProgressionMethodStrategyFactory {
  static for(
    prescription: VO.ExercisePrescriptionType,
    previous: Pick<Queries.ExercisePerformance, "sets">,
  ): ProgressionMethodStrategy {
    const last = new ExercisePerformanceWeakestSet(previous).calculate();

    switch (prescription.progression) {
      case Plans.VO.ProgressionMethodOptions.double_progression:
        return new ProgressionMethodDoubleProgressionStrategy(prescription, last);
      case Plans.VO.ProgressionMethodOptions.linear_progression:
        return new ProgressionMethodLinearProgressionStrategy(last);
      case Plans.VO.ProgressionMethodOptions.none:
        return new ProgressionMethodNoneStrategy(last);
    }
  }
}
