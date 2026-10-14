import type * as Auth from "+auth";
import type { DailyStepsDayType } from "./daily-steps-day";
import type { StepsCountType } from "./steps-count";
import type { StepsSourceType } from "./steps-source";

export type DailySteps = {
  userId: Auth.VO.UserIdType;
  day: DailyStepsDayType;
  count: StepsCountType;
  source: StepsSourceType;
};
