import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionRirIsApplicableForRepsError extends Error {}

type PlanSectionExerciseInstructionRirIsApplicableForRepsConfigType = Pick<
  VO.ExerciseInstructionType,
  "reps" | "rir"
>;

class PlanSectionExerciseInstructionRirIsApplicableForRepsFactory extends bg.Invariant<PlanSectionExerciseInstructionRirIsApplicableForRepsConfigType> {
  passes(config: PlanSectionExerciseInstructionRirIsApplicableForRepsConfigType) {
    if (config.rir === undefined) return true;
    return VO.RepsScheme.allowsRir(VO.RepsScheme.of(config.reps));
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.rir.is.applicable.for.reps";
  error = PlanSectionExerciseInstructionRirIsApplicableForRepsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionRirIsApplicableForReps =
  new PlanSectionExerciseInstructionRirIsApplicableForRepsFactory();
