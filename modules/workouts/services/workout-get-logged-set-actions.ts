import type * as tools from "@bgord/tools";
import { ActionBlocker, ActionState } from "+action-state";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";
import { WorkoutIsCorrectable } from "../invariants/workout-is-correctable";
import { WorkoutRetainsLoggedSets } from "../invariants/workout-retains-logged-sets";

type WorkoutGetLoggedSetActionsFacts = {
  status: VO.WorkoutStatusEnum;
  loggedSetCount: tools.IntegerNonNegativeType;
};

export class WorkoutGetLoggedSetActions {
  constructor(private readonly facts: WorkoutGetLoggedSetActionsFacts) {}

  calculate(): Queries.LoggedSetActions {
    const correctable = WorkoutIsCorrectable.passes({ status: this.facts.status });

    return {
      correct: ActionState.of(correctable),
      remove: ActionState.of(correctable, [
        ActionBlocker.from(WorkoutRetainsLoggedSets, {
          status: this.facts.status,
          count: this.facts.loggedSetCount,
        }),
      ]),
    };
  }
}
