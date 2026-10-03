import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import { PlanSectionExerciseExists } from "../invariants/plan-section-exercise-exists";
import { PlanSectionExerciseInstructionProgressionIsApplicable } from "../invariants/plan-section-exercise-instruction-progression-is-applicable";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
  GetExerciseOHQ: Exercises.OHQ.GetExerciseOHQ;
};

export const handlePlanSectionExerciseInstructionAddCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionExerciseInstructionAddCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);

    const exercise = await deps.GetExerciseOHQ.execute(command.payload.exerciseInstruction.exerciseId);

    PlanSectionExerciseExists.enforce({ exercise });
    PlanSectionExerciseInstructionProgressionIsApplicable.enforce({
      loading: exercise!.loading,
      progression: command.payload.exerciseInstruction.progression,
    });

    plan.addSectionExerciseInstruction(
      command.payload.planSectionId,
      command.payload.exerciseInstruction,
      command.payload.requesterId,
    );
    await deps.repo.save(plan);
  };
