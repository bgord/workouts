import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import { PlanSectionExerciseExists } from "../invariants/plan-section-exercise-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
  GetExerciseOHQ: Exercises.OHQ.GetExerciseOHQ;
};

export const handlePlanSectionExerciseInstructionAddCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionExerciseInstructionAddCommandType) => {
    const exercise = await deps.GetExerciseOHQ.execute(command.payload.exerciseInstruction.exerciseId);

    PlanSectionExerciseExists.enforce({ exercise });

    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);
    plan.addSectionExerciseInstruction(
      command.payload.planSectionId,
      command.payload.exerciseInstruction,
      command.payload.requesterId,
    );
    await deps.repo.save(plan);
  };
