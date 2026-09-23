import * as Plans from "+plans";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { ProgressionMethodDoubleProgressionStrategy } from "./progression-method-double-progression.strategy";
import { ProgressionMethodLinearProgressionStrategy } from "./progression-method-linear-progression.strategy";

export class ProgressionMethodStrategyFactory {
  static for(
    prescription: VO.ExercisePrescriptionType,
    previous: Pick<Queries.ExercisePerformance, "sets">,
  ): ProgressionMethodStrategy {
    switch (prescription.progression) {
      case Plans.VO.ProgressionMethodOptions.double_progression:
        return new ProgressionMethodDoubleProgressionStrategy(prescription, previous);
      case Plans.VO.ProgressionMethodOptions.linear_progression:
        return new ProgressionMethodLinearProgressionStrategy(previous);
    }
  }
}
