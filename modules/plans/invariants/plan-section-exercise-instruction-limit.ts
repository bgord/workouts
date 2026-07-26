import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanSectionExerciseInstructionLimitError.prototype);
  }
}

type PlanSectionExerciseInstructionLimitConfigType = { planSection: VO.PlanSection };

class PlanSectionExerciseInstructionLimitFactory extends bg.Invariant<PlanSectionExerciseInstructionLimitConfigType> {
  passes(config: PlanSectionExerciseInstructionLimitConfigType) {
    return config.planSection.exerciseInstructions.length <= 20;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.limit";
  error = PlanSectionExerciseInstructionLimitError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionLimit = new PlanSectionExerciseInstructionLimitFactory();
