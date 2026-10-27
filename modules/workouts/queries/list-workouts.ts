import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

export type WorkoutSection = { id: Plans.VO.PlanSectionIdType; name: VO.WorkoutPlanSectionNameType };

export type WorkoutListPlanSection = {
  id: Plans.VO.PlanSectionIdType;
  name: Plans.VO.PlanSectionNameType;
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

export type WorkoutListPage = bg.Page<VO.WorkoutSummary, VO.WorkoutListCursorType>;

export type WorkoutListPageConfig = {
  filter: VO.WorkoutListFilterOptions;
  section?: string;
  cursor?: VO.WorkoutListCursorType;
  limit: tools.IntegerPositiveType;
};

export type WorkoutList = {
  data: WorkoutListPage;
  matching: tools.IntegerNonNegativeType;
  sections: ReadonlyArray<WorkoutSection>;
  plan: WorkoutListPlan | null;
  actions: { create: bg.ActionState };
};

export interface ListWorkouts {
  execute(
    userId: Auth.VO.UserIdType,
    config: WorkoutListPageConfig,
    now: tools.Timestamp,
  ): Promise<WorkoutList>;
}
