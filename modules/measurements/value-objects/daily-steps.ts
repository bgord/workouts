import type * as Auth from "+auth";
import type { StepsCountType } from "./steps-count";
import type { StepsDayType } from "./steps-day";
import type { StepsSourceType } from "./steps-source";

export type DailySteps = {
  userId: Auth.VO.UserIdType;
  day: StepsDayType;
  count: StepsCountType;
  source: StepsSourceType;
};
