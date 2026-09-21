import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionPositionInRangeError extends Error {}

type PlanSectionExerciseInstructionPositionInRangeConfigType = {
  planSection: VO.PlanSection | undefined;
  position: VO.ExerciseInstructionPositionType;
};

class PlanSectionExerciseInstructionPositionInRangeFactory extends bg.Invariant<PlanSectionExerciseInstructionPositionInRangeConfigType> {
  passes(config: PlanSectionExerciseInstructionPositionInRangeConfigType) {
    return config.position < (config.planSection?.exerciseInstructions.length ?? 0);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.position.in.range";
  error = PlanSectionExerciseInstructionPositionInRangeError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionPositionInRange =
  new PlanSectionExerciseInstructionPositionInRangeFactory();
