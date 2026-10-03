import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionProgressionIsApplicableError extends Error {}

type PlanSectionExerciseInstructionProgressionIsApplicableConfigType = {
  loading: Exercises.VO.ExerciseLoadingType | null;
  progression: VO.ProgressionMethodType;
};

class PlanSectionExerciseInstructionProgressionIsApplicableFactory extends bg.Invariant<PlanSectionExerciseInstructionProgressionIsApplicableConfigType> {
  passes(config: PlanSectionExerciseInstructionProgressionIsApplicableConfigType) {
    if (config.loading === null) return true;

    return VO.ProgressionMethodApplicability[config.loading].includes(config.progression);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.progression.is.applicable";
  error = PlanSectionExerciseInstructionProgressionIsApplicableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionProgressionIsApplicable =
  new PlanSectionExerciseInstructionProgressionIsApplicableFactory();
