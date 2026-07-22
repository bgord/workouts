import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
};

export const handlePlanSectionCreateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanSectionCreateCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);

    plan.createSection(
      command.payload.planSectionId,
      command.payload.planSectionName,
      command.payload.ownerId,
    );

    await deps.repo.save(plan);
  };
