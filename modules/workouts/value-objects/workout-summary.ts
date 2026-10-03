import type * as tools from "@bgord/tools";
import type * as Plans from "+plans";
import type { WorkoutIdType } from "./workout-id";
import type { WorkoutPlanNameType } from "./workout-plan-name";
import type { WorkoutPlanSectionNameType } from "./workout-plan-section-name";
import type { WorkoutScheduledForType } from "./workout-scheduled-for";
import type { WorkoutStatusEnum } from "./workout-status";

export type WorkoutSummary = {
  id: WorkoutIdType;
  planId: Plans.VO.PlanIdType;
  planName: WorkoutPlanNameType;
  planSectionId: Plans.VO.PlanSectionIdType;
  planSectionName: WorkoutPlanSectionNameType;
  scheduledFor: WorkoutScheduledForType;
  status: WorkoutStatusEnum;
  completedAt: tools.TimestampValueType | null;
  revision: tools.RevisionValueType;
};
