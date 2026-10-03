import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { PlanSectionExerciseInstructionProgressionIsApplicable } from "../invariants/plan-section-exercise-instruction-progression-is-applicable";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
  GetExerciseInstructionLoadingQuery: Plans.Queries.GetExerciseInstructionLoading;
};

export const handlePlanSectionExerciseInstructionUpdateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionExerciseInstructionUpdateCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);

    const loading = await deps.GetExerciseInstructionLoadingQuery.execute(
      command.payload.exerciseInstruction.id,
    );

    PlanSectionExerciseInstructionProgressionIsApplicable.enforce({
      loading,
      progression: command.payload.exerciseInstruction.progression,
    });

    plan.updateSectionExerciseInstruction(
      command.payload.planSectionId,
      command.payload.exerciseInstruction,
      command.payload.requesterId,
    );
    await deps.repo.save(plan);
  };
