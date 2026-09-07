import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export type PlanListData = {
  active: ReadonlyArray<VO.PlanSummary>;
  archived: ReadonlyArray<VO.PlanSummary>;
};

export type PlanListHints = {
  create: bg.TranslationsKeyType | null;
};

export type PlanListResponse = {
  data: PlanListData;
  hints: PlanListHints;
};

export interface ListPlans {
  execute(userId: Auth.VO.UserIdType): Promise<PlanListResponse>;
}
