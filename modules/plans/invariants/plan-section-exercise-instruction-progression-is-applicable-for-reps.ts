import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanSectionExerciseInstructionProgressionIsApplicableForRepsError extends Error {}

type PlanSectionExerciseInstructionProgressionIsApplicableForRepsConfigType = Pick<
  VO.ExerciseInstructionType,
  "reps" | "progression"
>;

class PlanSectionExerciseInstructionProgressionIsApplicableForRepsFactory extends bg.Invariant<PlanSectionExerciseInstructionProgressionIsApplicableForRepsConfigType> {
  passes(config: PlanSectionExerciseInstructionProgressionIsApplicableForRepsConfigType) {
    return VO.RepsScheme.allowsProgression(VO.RepsScheme.of(config.reps), config.progression);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exercise.instruction.progression.is.applicable.for.reps";
  error = PlanSectionExerciseInstructionProgressionIsApplicableForRepsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExerciseInstructionProgressionIsApplicableForReps =
  new PlanSectionExerciseInstructionProgressionIsApplicableForRepsFactory();
