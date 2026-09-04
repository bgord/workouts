import type * as tools from "@bgord/tools";
import type * as Plans from "+plans";
import type { WorkoutIdType } from "./workout-id";
import type { WorkoutScheduledForType } from "./workout-scheduled-for";
import type { WorkoutStatusEnum } from "./workout-status";

export type WorkoutSummary = {
  id: WorkoutIdType;
  planId: Plans.VO.PlanIdType;
  planName: Plans.VO.PlanNameType;
  planSectionId: Plans.VO.PlanSectionIdType;
  planSectionName: Plans.VO.PlanSectionNameType;
  scheduledFor: WorkoutScheduledForType;
  status: WorkoutStatusEnum;
  completedAt?: tools.TimestampValueType;
  revision: tools.RevisionValueType;
};
