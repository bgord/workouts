import type * as tools from "@bgord/tools";
import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

export type WorkoutSection = { id: Plans.VO.PlanSectionIdType; name: Plans.VO.PlanSectionNameType };

export type WorkoutListResponse = {
  data: ReadonlyArray<VO.WorkoutSummary>;
  sections: ReadonlyArray<WorkoutSection>;
  actions: { create: ActionState };
};

export interface ListWorkouts {
  execute(
    userId: Auth.VO.UserIdType,
    filter: VO.WorkoutListFilterOptions,
    now: tools.Timestamp,
  ): Promise<WorkoutListResponse>;
}
