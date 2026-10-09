import * as bg from "@bgord/bun";
import * as VO from "+exercises/value-objects";

class ExerciseLoadStepIsApplicableError extends Error {}

type ExerciseLoadStepIsApplicableConfigType = {
  resistance: VO.ExerciseResistanceType;
  loadStep: VO.ExerciseLoadStepType;
};

class ExerciseLoadStepIsApplicableFactory extends bg.Invariant<ExerciseLoadStepIsApplicableConfigType> {
  passes(config: ExerciseLoadStepIsApplicableConfigType) {
    return VO.ExerciseLoadStepApplicability.isApplicable(config.resistance, config.loadStep);
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.load.step.is.applicable";
  error = ExerciseLoadStepIsApplicableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseLoadStepIsApplicable = new ExerciseLoadStepIsApplicableFactory();
