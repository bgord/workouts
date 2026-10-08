import * as v from "valibot";
import * as Plans from "+plans";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { ExercisePerformanceEffort } from "./exercise-performance-effort";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";
import { LoadStepStrategyFactory } from "./load-step-factory.strategy";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { ProgressionMethodDoubleProgressionStrategy } from "./progression-method-double-progression.strategy";
import { ProgressionMethodEffortGateStrategy } from "./progression-method-effort-gate.strategy";
import { ProgressionMethodLinearProgressionStrategy } from "./progression-method-linear-progression.strategy";
import { ProgressionMethodNoneStrategy } from "./progression-method-none.strategy";
import { ProgressionMethodRepProgressionStrategy } from "./progression-method-rep-progression.strategy";

export class ProgressionMethodStrategyFactory {
  static for(
    prescription: VO.ExercisePrescriptionType,
    resistance: VO.WorkoutExerciseResistanceType,
    previous: Pick<Queries.ExercisePerformance, "sets">,
  ): ProgressionMethodEffortGateStrategy {
    const effort = new ExercisePerformanceEffort(previous).calculate();
    const ProgressionMethod = ProgressionMethodStrategyFactory.method(prescription, resistance, previous);

    return new ProgressionMethodEffortGateStrategy({ prescription, effort }, { ProgressionMethod });
  }

  private static method(
    prescription: VO.ExercisePrescriptionType,
    resistance: VO.WorkoutExerciseResistanceType,
    previous: Pick<Queries.ExercisePerformance, "sets">,
  ): ProgressionMethodStrategy {
    const weakest = new ExercisePerformanceWeakestSet(previous).calculate();
    const last = v.parse(VO.ExerciseTarget, { ...weakest, sets: prescription.sets });
    const LoadStep = LoadStepStrategyFactory.for(resistance);

    switch (prescription.progression) {
      case Plans.VO.ProgressionMethodOptions.double_progression:
        return new ProgressionMethodDoubleProgressionStrategy({ prescription, last }, { LoadStep });
      case Plans.VO.ProgressionMethodOptions.linear_progression:
        return new ProgressionMethodLinearProgressionStrategy({ prescription, last }, { LoadStep });
      case Plans.VO.ProgressionMethodOptions.rep_progression:
        return new ProgressionMethodRepProgressionStrategy({ prescription, last });
      case Plans.VO.ProgressionMethodOptions.none:
        return new ProgressionMethodNoneStrategy({ last });
    }
  }
}
