import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionProgressionIsApplicableError extends Error {}

type PlanSectionExerciseInstructionProgressionIsApplicableConfigType = {
  resistance: Exercises.VO.ExerciseResistanceType | null;
  progression: VO.ProgressionMethodType;
};

class PlanSectionExerciseInstructionProgressionIsApplicableFactory extends bg.Invariant<PlanSectionExerciseInstructionProgressionIsApplicableConfigType> {
  passes(config: PlanSectionExerciseInstructionProgressionIsApplicableConfigType) {
    if (config.resistance === null) return true;

    return VO.ProgressionMethodApplicability[config.resistance].includes(config.progression);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.progression.is.applicable";
  error = PlanSectionExerciseInstructionProgressionIsApplicableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionProgressionIsApplicable =
  new PlanSectionExerciseInstructionProgressionIsApplicableFactory();
