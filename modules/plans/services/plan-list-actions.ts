import type * as tools from "@bgord/tools";
import { ActionBlocker, ActionState } from "+action-state";
import type * as Queries from "+plans/queries";
import { PlanLimitForOwner } from "../invariants/plan-limit-for-owner";

type PlanListActionsFacts = { activeCount: tools.IntegerNonNegativeType };

export class PlanListActions {
  constructor(private readonly facts: PlanListActionsFacts) {}

  calculate(): Queries.PlanListResponse["actions"] {
    return {
      create: ActionState.of(true, [
        ActionBlocker.from(PlanLimitForOwner, { count: this.facts.activeCount }),
      ]),
    };
  }
}
