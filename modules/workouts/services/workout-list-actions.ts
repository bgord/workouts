import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Plans from "+plans";
import type * as Queries from "+workouts/queries";
import { WorkoutDraftLimitForOwner } from "../invariants/workout-draft-limit-for-owner";
import { WorkoutPlanReady } from "../invariants/workout-plan-ready";

type WorkoutListActionsFacts = {
  plan: Pick<Plans.VO.PlanSummary, "id"> | null;
  draftCount: tools.IntegerNonNegativeType;
};

export class WorkoutListActions {
  constructor(private readonly facts: WorkoutListActionsFacts) {}

  calculate(): Queries.WorkoutListResponse["actions"] {
    return {
      create: bg.ActionState.of(true, [
        bg.ActionBlocker.from(WorkoutPlanReady, { plan: this.facts.plan }),
        bg.ActionBlocker.from(WorkoutDraftLimitForOwner, { count: this.facts.draftCount }),
      ]),
    };
  }
}
