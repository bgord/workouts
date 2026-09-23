import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

export type WorkoutSection = { id: Plans.VO.PlanSectionIdType; name: Plans.VO.PlanSectionNameType };

export type WorkoutListPlanSection = WorkoutSection & {
  exerciseInstructions: ReadonlyArray<{
    id: Plans.VO.ExerciseInstructionIdType;
    exercise: { name: Exercises.VO.ExerciseNameType };
  }>;
};

export type WorkoutListPlan = {
  id: Plans.VO.PlanIdType;
  name: Plans.VO.PlanNameType;
  sections: ReadonlyArray<WorkoutListPlanSection>;
};

export type WorkoutListResponse = {
  data: ReadonlyArray<VO.WorkoutSummary>;
  sections: ReadonlyArray<WorkoutSection>;
  plan: WorkoutListPlan | null;
  actions: { create: bg.ActionState };
};

export interface ListWorkouts {
  execute(
    userId: Auth.VO.UserIdType,
    filter: VO.WorkoutListFilterOptions,
    now: tools.Timestamp,
  ): Promise<WorkoutListResponse>;
}
