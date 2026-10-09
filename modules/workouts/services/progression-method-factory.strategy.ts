import * as v from "valibot";
import type * as Exercises from "+exercises";
import * as Plans from "+plans";
import type * as Queries from "+workouts/queries";
import * as VO from "+workouts/value-objects";
import { ExercisePerformanceLowestRir } from "./exercise-performance-lowest-rir";
import { ExercisePerformanceWeakestSet } from "./exercise-performance-weakest-set";
import { LoadStepStrategyFactory } from "./load-step-factory.strategy";
import type { ProgressionMethodStrategy } from "./progression-method.strategy";
import { ProgressionMethodDoubleProgressionStrategy } from "./progression-method-double-progression.strategy";
import { ProgressionMethodLinearProgressionStrategy } from "./progression-method-linear-progression.strategy";
import { ProgressionMethodNoneStrategy } from "./progression-method-none.strategy";
import { ProgressionMethodRepProgressionStrategy } from "./progression-method-rep-progression.strategy";
import { ProgressionMethodRirGateStrategy } from "./progression-method-rir-gate.strategy";
import { ProgressionMethodSetsGateStrategy } from "./progression-method-sets-gate.strategy";

export class ProgressionMethodStrategyFactory {
  static for(
    prescription: VO.ExercisePrescriptionType,
    loadStep: Exercises.VO.ExerciseLoadStepType,
    previous: Pick<Queries.ExercisePerformance, "sets">,
  ): ProgressionMethodRirGateStrategy {
    const rir = new ExercisePerformanceLowestRir(previous).calculate();
    const weakest = new ExercisePerformanceWeakestSet(previous).calculate();
    const ProgressionMethod = new ProgressionMethodSetsGateStrategy(
      { prescription, sets: weakest.sets },
      { ProgressionMethod: ProgressionMethodStrategyFactory.method(prescription, loadStep, weakest) },
    );

    return new ProgressionMethodRirGateStrategy({ prescription, rir }, { ProgressionMethod });
  }

  private static method(
    prescription: VO.ExercisePrescriptionType,
    loadStep: Exercises.VO.ExerciseLoadStepType,
    weakest: VO.ExerciseTargetType,
  ): ProgressionMethodStrategy {
    const last = v.parse(VO.ExerciseTarget, { ...weakest, sets: prescription.sets });
    const LoadStep = LoadStepStrategyFactory.for(loadStep);

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
