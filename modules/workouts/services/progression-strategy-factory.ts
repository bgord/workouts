import * as Plans from "+plans";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { DoubleProgressionCalculator } from "./double-progression-calculator";
import type { ProgressionStrategy } from "./progression-strategy";

export class ProgressionStrategyFactory {
  static for(
    prescription: VO.ExercisePrescriptionType,
    previous: Queries.ExercisePerformance,
  ): ProgressionStrategy {
    switch (prescription.progression) {
      case Plans.VO.ProgressionMethodOptions.double_progression:
        return new DoubleProgressionCalculator(prescription, previous);
    }
  }
}
