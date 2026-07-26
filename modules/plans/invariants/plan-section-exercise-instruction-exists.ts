import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanSectionExerciseInstructionExistsError.prototype);
  }
}

type PlanSectionExerciseInstructionExistsConfigType = {
  planSection: VO.PlanSection;
  exerciseInstructionId: VO.ExerciseInstructionIdType;
};

class PlanSectionExerciseInstructionExistsFactory extends bg.Invariant<PlanSectionExerciseInstructionExistsConfigType> {
  passes(config: PlanSectionExerciseInstructionExistsConfigType) {
    return config.planSection.exerciseInstructions.some(
      (exerciseInstruction) => exerciseInstruction.id === config.exerciseInstructionId,
    );
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.exists";
  error = PlanSectionExerciseInstructionExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionExists = new PlanSectionExerciseInstructionExistsFactory();
