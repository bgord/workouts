import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { PlanLimitForOwner } from "../invariants/plan-limit-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Plans.Ports.PlanRepositoryPort;
  GetPlanEditableForOwnerCountQuery: Plans.Queries.GetPlanEditableForOwnerCount;
};

export const handlePlanRestoreCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanRestoreCommandType) => {
    const plan = await deps.repo.load(command.payload.planId);
    command.revision.validate(plan.revision.value);

    const count = await deps.GetPlanEditableForOwnerCountQuery.execute(command.payload.requesterId);

    PlanLimitForOwner.enforce({ count });

    plan.restore(command.payload.requesterId);
    await deps.repo.save(plan);
  };
